import { EthereumTransactionUtils } from '../ethereum/transaction';
import {
    ITransferTransaction,
    IBlockchainTransaction,
    TransactionType,
    IPosTransaction
} from '../types';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { Celo } from '.';
import { TokenType, PosBasicActionType } from '../types/token';
import { TransactionStatus } from '../../wallet/types';
import abi from 'ethereumjs-abi';
import BigNumber from 'bignumber.js';
import { keccak256 } from './library/hash';
import { encode } from './library/rlp';
import elliptic from 'elliptic';
import { Contracts } from './config';
import { fixEthAddress } from '../../utils/format-address';

const toHex = value => {
    if (value && value !== '0x') {
        const base = typeof value === 'string' && value.indexOf('0x') === 0 ? 16 : 10;

        let stringValue = new BigNumber(value, base).toString(16);
        if (stringValue.length % 2 > 0) {
            stringValue = '0' + stringValue;
        }
        return '0x' + stringValue;
    }
    return '0x';
};

export class CeloTransactionUtils extends EthereumTransactionUtils {
    public async sign(tx: IBlockchainTransaction, privateKey: string): Promise<any> {
        const txData = [
            toHex(tx.nonce),
            toHex(tx.feeOptions.gasPrice),
            toHex(tx.feeOptions.gasLimit),
            '0x', // feeCurrency
            '0x', // gatewayFeeRecipient
            '0x', // gatewayFee
            (tx.toAddress || '0x').toLowerCase(),
            tx.amount === '0' ? '0x' : toHex(tx.amount),
            (tx.data.raw || '0x').toLowerCase(),
            toHex(tx.chainId || 1)
        ];

        const encodedTx = encode(txData.concat(['0x', '0x']));
        const txHash = keccak256(encodedTx);
        const addToV = Number(tx.chainId) * 2 + 35;

        privateKey = '0x' + privateKey.replace(/^0x/gi, '').toLowerCase();

        const ecSignature = new elliptic.ec('secp256k1')
            .keyFromPrivate(Buffer.from(privateKey.replace(/^0x/gi, ''), 'hex'))
            .sign(Buffer.from(txHash.replace(/^0x/gi, ''), 'hex'), { canonical: true });

        const signature = {
            v: toHex(addToV + ecSignature.recoveryParam),
            r: '0x' + ecSignature.r.toString(16),
            s: '0x' + ecSignature.s.toString(16)
        };

        const rawTx = txData.slice(0, 9).concat([signature.v, signature.r, signature.s]);

        return encode(rawTx);
    }

    public async buildPosTransaction(
        tx: IPosTransaction,
        transactionType: PosBasicActionType
    ): Promise<IBlockchainTransaction[]> {
        const client = Celo.getClient(tx.chainId);

        const transactions: IBlockchainTransaction[] = [];

        switch (transactionType) {
            case PosBasicActionType.DELEGATE: {
                const amountLocked: BigNumber = await client.contracts[
                    Contracts.LOCKED_GOLD
                ].getAccountNonvotingLockedGold(tx.account.address);

                // const isRegisteredAccount = await client.contracts[
                //     Contracts.ACCOUNTS
                // ].isRegisteredAccount(tx.account.address);

                if (!amountLocked.isGreaterThan(new BigNumber(tx.amount))) {
                    const txLock: IPosTransaction = { ...tx };
                    txLock.amount = new BigNumber(tx.amount).minus(amountLocked).toString();
                    transactions.push(await client.contracts[Contracts.LOCKED_GOLD].lock(txLock));
                }

                const splitAmount = new BigNumber(tx.amount).dividedBy(tx.validators.length);

                await Promise.all(
                    tx.validators.map(async validator => {
                        const txVote: IPosTransaction = { ...tx };
                        txVote.amount = splitAmount.toString();
                        transactions.push(
                            await client.contracts[Contracts.ELECTION].vote(
                                tx,
                                validator.id.toLowerCase()
                            )
                        );
                    })
                );
                break;
            }
            case PosBasicActionType.ACTIVATE: {
                // TODO - can use this once we have the groups that account has pending votes
                // const groups = await this.contract.methods.getGroupsVotedForByAccount(account).call()
                // const isActivatable = await Promise.all(
                //   groups.map((g) => this.contract.methods.hasActivatablePendingVotes(account, g).call())
                // )
                // const groupsActivatable = groups.filter((_, i) => isActivatable[i])
                // return groupsActivatable.map((g) => this._activate(g))

                const transaction = await client.contracts[Contracts.ELECTION].ACTIVATE(tx, '');
                if (transaction) transactions.push(transaction);
                break;
            }
            case PosBasicActionType.UNLOCK: {
                const transaction = await client.contracts[Contracts.LOCKED_GOLD].unlock(tx);
                if (transaction) transactions.push(transaction);
                break;
            }
            case PosBasicActionType.UNVOTE: {
                const groupAddress = tx.validators[0].id.toLowerCase();
                const amount = new BigNumber(tx.amount);

                const groups = await client.contracts[
                    Contracts.ELECTION
                ].getGroupsVotedForByAccount(tx.account.address);
                const indexForGroup = groups.findIndex(
                    group => fixEthAddress(group) === groupAddress
                );

                const { pending } = await client.contracts[
                    Contracts.ELECTION
                ].getVotesForGroupByAccount(tx.account.address, groupAddress);

                const pendingValue = BigNumber.minimum(pending, amount);
                if (!pendingValue.isZero()) {
                    const txRevokePending: IPosTransaction = { ...tx };
                    txRevokePending.amount = pendingValue.toFixed();
                    const transaction = await client.contracts[Contracts.ELECTION].revokePending(
                        txRevokePending,
                        indexForGroup
                    );
                    if (transaction) transactions.push(transaction);
                }

                if (pendingValue.lt(amount)) {
                    const activeValue = amount.minus(pendingValue);
                    const txRevoke: IPosTransaction = { ...tx };
                    txRevoke.amount = activeValue.toFixed();
                    const transaction = await client.contracts[Contracts.ELECTION].revokeActive(
                        txRevoke,
                        indexForGroup
                    );
                    if (transaction) transactions.push(transaction);
                }

                break;
            }
            case PosBasicActionType.WITHDRAW: {
                const transaction = await client.contracts[Contracts.LOCKED_GOLD].withdraw(
                    tx,
                    tx.extraFields.witdrawIndex
                );
                if (transaction) transactions.push(transaction);
                break;
            }
        }

        return transactions;
    }

    public async buildTransferTransaction(
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction> {
        const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

        const client = Celo.getClient(tx.chainId);
        const nonce = await client.getNonce(tx.account.address, tx.account.publicKey);
        const blockInfo = await client.getCurrentBlock();

        switch (tokenConfig.type) {
            case TokenType.ERC20:
                return {
                    date: {
                        created: Date.now(),
                        signed: Date.now(),
                        broadcasted: Date.now(),
                        confirmed: Date.now()
                    },
                    blockchain: tx.account.blockchain,
                    chainId: tx.chainId,
                    type: TransactionType.TRANSFER,
                    token: tokenConfig,
                    address: tx.account.address,
                    publicKey: tx.account.publicKey,
                    toAddress: tokenConfig.contractAddress,
                    amount: '0',
                    feeOptions: tx.feeOptions,
                    broadcastedOnBlock: blockInfo?.number,
                    nonce,
                    status: TransactionStatus.PENDING,
                    data: {
                        method: 'transfer',
                        params: [tx.toAddress, tx.amount],
                        raw:
                            '0x' +
                            abi
                                .simpleEncode('transfer(address,uint256)', tx.toAddress, tx.amount)
                                .toString('hex')
                    }
                };

            // case TokenType.NATIVE:
            default:
                return {
                    date: {
                        created: Date.now(),
                        signed: Date.now(),
                        broadcasted: Date.now(),
                        confirmed: Date.now()
                    },
                    blockchain: tx.account.blockchain,
                    chainId: tx.chainId,
                    type: TransactionType.TRANSFER,
                    token: tokenConfig,
                    address: tx.account.address,
                    publicKey: tx.account.publicKey,

                    toAddress: tx.toAddress,
                    amount: tx.amount,
                    feeOptions: tx.feeOptions,
                    broadcastedOnBlock: blockInfo?.number,
                    nonce,
                    status: TransactionStatus.PENDING
                };
        }
    }
}
