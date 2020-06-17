import { Client } from '../client';
import { IPosTransaction, IBlockchainTransaction } from '../../types';
import abi from 'ethereumjs-abi';
import { getContract, buildBaseTransaction } from './base-contract';
import { Contracts } from '../config';
import BigNumber from 'bignumber.js';
import { fixEthAddress } from '../../../utils/format-address';

export class Election {
    constructor(private client: Client) {}

    public async vote(tx: IPosTransaction, address: string): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);

        const { lesser, greater } = await this.findLesserAndGreaterAfterVote(
            address,
            new BigNumber(tx.amount)
        );

        transaction.amount = '0';
        transaction.toAddress = contractAddress;

        transaction.data = {
            method: 'vote',
            params: [address, tx.amount],
            raw:
                '0x' +
                abi
                    .simpleEncode(
                        'vote(address,uint256,address,address)',
                        address,
                        tx.amount,
                        lesser,
                        greater
                    )
                    .toString('hex')
        };

        return transaction;
    }

    public async revokeActive(
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

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        transaction.data = {
            method: 'revokeActive',
            params: [groupAddress, tx.amount],
            raw:
                '0x' +
                abi
                    .simpleEncode(
                        'revokeActive(address,uint256,address,address,uint256)',
                        groupAddress,
                        new BigNumber(tx.amount).toFixed(),
                        lesser,
                        greater,
                        indexForGroup
                    )
                    .toString('hex')
        };

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

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        transaction.data = {
            method: 'revokeActive',
            params: [groupAddress, tx.amount],
            raw:
                '0x' +
                abi
                    .simpleEncode(
                        'revokePending(address,uint256,address,address,uint256)',
                        groupAddress,
                        new BigNumber(tx.amount).toFixed(),
                        lesser,
                        greater,
                        indexForGroup
                    )
                    .toString('hex')
        };

        return transaction;
    }

    public async activate(tx: IPosTransaction, address: string): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        transaction.data = {
            method: 'activate',
            params: [address],
            raw: '0x' + abi.simpleEncode('activate(address)', address).toString('hex')
        };

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

    public async getGroupsVotedForByAccount(accountAddress: string): Promise<string[]> {
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);
        return this.client
            .callContract(contractAddress, 'getGroupsVotedForByAccount(address):(address[])', [
                accountAddress
            ])
            .then(res => {
                if (res && typeof res === 'string') {
                    return [res];
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
