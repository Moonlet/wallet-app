import { Client } from '../client';
import { IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';
import abi from 'ethereumjs-abi';
import { getContract, buildBaseTransaction } from './base-contract';
import { Contracts } from '../config';
import BigNumber from 'bignumber.js';
import { fixEthAddress } from '../../../utils/format-address';
import { PosBasicActionType, TokenType } from '../../types/token';
import { IValidator } from '../../types/stats';

export class Election {
    constructor(private client: Client) {}

    public async vote(tx: IPosTransaction, validator: IValidator): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);

        const { lesser, greater } = await this.findLesserAndGreaterAfterVote(
            validator.id,
            new BigNumber(tx.amount)
        );

        transaction.amount = '0';
        transaction.toAddress = contractAddress;

        const raw =
            '0x' +
            abi
                .simpleEncode(
                    'vote(address,uint256,address,address)',
                    validator.id,
                    new BigNumber(tx.amount).toFixed(),
                    lesser,
                    greater
                )
                .toString('hex');

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: validator.id,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ERC20
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'vote',
            params: [validator.id, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.DELEGATE;
        transaction.additionalInfo.validatorName = validator.name;

        return transaction;
    }

    public async revokeActive(
        tx: IPosTransaction,
        indexForGroup: number
    ): Promise<IBlockchainTransaction> {
        const groupAddress = tx.validators[0].id;
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);

        if (indexForGroup === -1) return undefined;

        const { lesser, greater } = await this.findLesserAndGreaterAfterVote(
            groupAddress,
            new BigNumber(tx.amount).times(-1)
        );

        const raw =
            '0x' +
            abi
                .simpleEncode(
                    'revokeActive(address,uint256,address,address,uint256)',
                    fixEthAddress(groupAddress),
                    new BigNumber(tx.amount).toFixed(),
                    lesser,
                    greater,
                    indexForGroup
                )
                .toString('hex');
        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: groupAddress,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ERC20
        );
        transaction.feeOptions = fees;

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        transaction.data = {
            method: 'unvote',
            params: [groupAddress, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.UNVOTE;

        return transaction;
    }

    public async revokePending(
        tx: IPosTransaction,
        indexForGroup: number
    ): Promise<IBlockchainTransaction> {
        const groupAddress = tx.validators[0].id.toLowerCase();
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);

        if (indexForGroup === -1) return undefined;

        const { lesser, greater } = await this.findLesserAndGreaterAfterVote(
            groupAddress,
            new BigNumber(tx.amount).times(-1)
        );

        const raw =
            '0x' +
            abi
                .simpleEncode(
                    'revokePending(address,uint256,address,address,uint256)',
                    fixEthAddress(groupAddress),
                    new BigNumber(tx.amount).toFixed(),
                    lesser,
                    greater,
                    indexForGroup
                )
                .toString('hex');

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: groupAddress,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ERC20
        );
        transaction.feeOptions = fees;

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        transaction.data = {
            method: 'unvote',
            params: [groupAddress, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.UNVOTE;

        return transaction;
    }

    public async activate(tx: IPosTransaction, address: string): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);

        const raw =
            '0x' + abi.simpleEncode('activate(address)', fixEthAddress(address)).toString('hex');

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: address,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ERC20
        );
        transaction.feeOptions = fees;

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        transaction.data = {
            method: 'activate',
            params: [address, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.ACTIVATE;

        return transaction;
    }

    public async getVotesForGroupByAccount(
        accountAddress: string,
        groupAddress: string
    ): Promise<any> {
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);
        const pendingVotes = await this.client.callContract(
            contractAddress,
            'getPendingVotesForGroupByAccount(address,address):(uint256)',
            [groupAddress, accountAddress]
        );

        const activeVotes = await this.client.callContract(
            contractAddress,
            'getActiveVotesForGroupByAccount(address,address):(uint256)',
            [groupAddress, accountAddress]
        );

        return {
            pending: new BigNumber(pendingVotes as string),
            active: new BigNumber(activeVotes as string)
        };
    }

    public async findLesserAndGreaterAfterVote(
        votedGroup: string,
        voteWeight: BigNumber
    ): Promise<{ lesser: string; greater: string }> {
        const currentVotes = await this.getTotalVotesForEligibleValidatorGroups();

        const selectedGroup = currentVotes.find(
            votes => fixEthAddress(votes.address) === votedGroup
        );
        const voteTotal = selectedGroup ? selectedGroup.votes.plus(voteWeight) : voteWeight;
        let greaterKey = '0x';
        let lesserKey = '0x';

        for (const vote of currentVotes) {
            if (fixEthAddress(vote.address) !== votedGroup) {
                if (vote.votes.isLessThanOrEqualTo(voteTotal)) {
                    lesserKey = vote.address;
                    break;
                }
                greaterKey = vote.address;
            }
        }

        return {
            lesser: fixEthAddress(lesserKey),
            greater: fixEthAddress(greaterKey)
        };
    }

    public async hasActivatablePendingVotes(
        accountAddress: string,
        group: string
    ): Promise<boolean> {
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);

        const response = await this.client.callContract(
            contractAddress,
            'hasActivatablePendingVotes(address,address):(bool)',
            [accountAddress, fixEthAddress(group)]
        );

        if (response === 'false') return false;
        return true;
    }

    public async getGroupsVotedForByAccount(accountAddress: string): Promise<string[]> {
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);
        return this.client
            .callContract(contractAddress, 'getGroupsVotedForByAccount(address):(address[])', [
                accountAddress
            ])
            .then(res => {
                if (res && typeof res === 'string') {
                    return res.split(',');
                } else {
                    return res as string[];
                }
            });
    }

    public async getTotalVotesForEligibleValidatorGroups(): Promise<any> {
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);

        return this.client
            .callContract(
                contractAddress,
                'getTotalVotesForEligibleValidatorGroups():(address[],uint256[])'
            )
            .then(res => {
                if (res && res.length > 1) {
                    const addresses: [] = res[0].split(',');
                    const votes: [] = res[1].split(',');
                    const validatorList = [];
                    addresses.map((address: string, index: number) => {
                        const vote = votes[index];
                        validatorList.push({ address, votes: new BigNumber(vote) });
                    });
                    return validatorList.sort((a, b) =>
                        a.votes.isGreaterThanOrEqualTo(b.votes) ? 1 : -1
                    );
                }
            });
    }
}
