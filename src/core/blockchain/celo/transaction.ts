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
import cloneDeep from 'lodash/cloneDeep';
import { splitStake } from '../../utils/balance';

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

        rawTx[9] = this.makeEven(this.trimLeadingZero(rawTx[9]));
        rawTx[10] = this.makeEven(this.trimLeadingZero(rawTx[10]));
        rawTx[11] = this.makeEven(this.trimLeadingZero(rawTx[11]));

        return encode(rawTx);
    }

    trimLeadingZero(hex: string) {
        while (hex && hex.startsWith('0x0')) {
            hex = '0x' + hex.slice(3);
        }
        return hex;
    }

    makeEven(hex: string) {
        if (hex.length % 2 === 1) {
            hex = hex.replace('0x', '0x0');
        }
        return hex;
    }

    public async buildPosTransaction(
        tx: IPosTransaction,
        transactionType: PosBasicActionType
    ): Promise<IBlockchainTransaction[]> {
        const client = Celo.getClient(tx.chainId);

        const transactions: IBlockchainTransaction[] = [];

        switch (transactionType) {
            case PosBasicActionType.DELEGATE: {
                const isRegisteredAccount = await client.contracts[
                    Contracts.ACCOUNTS
                ].isRegisteredAccount(tx.account.address);

                if (!isRegisteredAccount) {
                    const txRegister: IPosTransaction = cloneDeep(tx);
                    const transaction = await client.contracts[Contracts.ACCOUNTS].createAccount(
                        txRegister
                    );
                    transaction.nonce = transaction.nonce + transactions.length;
                    transactions.push(transaction);
                }
                const amountLocked: BigNumber = await client.contracts[
                    Contracts.LOCKED_GOLD
                ].getAccountNonvotingLockedGold(tx.account.address);
                if (!amountLocked.isGreaterThanOrEqualTo(new BigNumber(tx.amount))) {
                    const txLock: IPosTransaction = cloneDeep(tx);
                    txLock.amount = new BigNumber(tx.amount).minus(amountLocked).toString();

                    const transaction = await client.contracts[Contracts.LOCKED_GOLD].lock(txLock);
                    transaction.nonce = transaction.nonce + transactions.length;
                    transactions.push(transaction);
                }

                const splitAmount = splitStake(new BigNumber(tx.amount), tx.validators.length);

                for (const validator of tx.validators) {
                    const txVote: IPosTransaction = cloneDeep(tx);
                    txVote.amount = splitAmount.toFixed(0, BigNumber.ROUND_DOWN);
                    const transaction: IBlockchainTransaction = await client.contracts[
                        Contracts.ELECTION
                    ].vote(txVote, validator);
                    transaction.nonce = transaction.nonce + transactions.length; // increase nonce with the number of previous transactions
                    transactions.push(transaction);
                }

                break;
            }
            case PosBasicActionType.REDELEGATE: {
                const txUnvote = cloneDeep(tx);
                txUnvote.validators = [tx.extraFields.fromValidator];
                const unvoteTransactions = await this.buildPosTransaction(
                    txUnvote,
                    PosBasicActionType.UNVOTE
                );

                transactions.push(...unvoteTransactions);

                const splitAmount = new BigNumber(tx.amount).dividedBy(tx.validators.length);

                for (const validator of tx.validators) {
                    const txVote: IPosTransaction = cloneDeep(tx);
                    txVote.amount = splitAmount.toString();
                    const transaction: IBlockchainTransaction = await client.contracts[
                        Contracts.ELECTION
                    ].vote(txVote, validator);
                    transaction.nonce = transaction.nonce + transactions.length; // increase nonce with the number of previous transactions
                    transactions.push(transaction);
                }

                break;
            }
            case PosBasicActionType.ACTIVATE: {
                const groups = await client.contracts[
                    Contracts.ELECTION
                ].getGroupsVotedForByAccount(tx.account.address);

                const promises = [];
                for (const group of groups) {
                    promises.push(
                        client.contracts[Contracts.ELECTION].hasActivatablePendingVotes(
                            tx.account.address,
                            group
                        )
                    );
                }

                const res = await Promise.all(promises);

                const txActivate: IPosTransaction = cloneDeep(tx);

                for (let i = 0; i < res.length; i++) {
                    if (res[i] === true) {
                        const transaction = await client.contracts[Contracts.ELECTION].activate(
                            txActivate,
                            groups[i]
                        );
                        transaction.nonce = transaction.nonce + transactions.length; // increase nonce with the number of previous transactions
                        transactions.push(transaction);
                    }
                }

                break;
            }
            case PosBasicActionType.UNLOCK: {
                const txUnlock = cloneDeep(tx);
                const transaction = await client.contracts[Contracts.LOCKED_GOLD].unlock(txUnlock);
                if (transaction) transactions.push(transaction);
                break;
            }
            case PosBasicActionType.UNVOTE: {
                const validator = tx.validators[0];
                const groupAddress = validator.id.toLowerCase();
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
                    const txRevokePending: IPosTransaction = cloneDeep(tx);
                    txRevokePending.amount = pendingValue.toFixed();
                    const transactionPending = await client.contracts[
                        Contracts.ELECTION
                    ].revokePending(txRevokePending, indexForGroup);

                    if (transactionPending) {
                        transactionPending.additionalInfo.validatorName = validator.name;
                        transactions.push(transactionPending);
                    }
                }

                if (pendingValue.lt(amount)) {
                    const activeValue = amount.minus(pendingValue);
                    const txRevoke: IPosTransaction = cloneDeep(tx);
                    txRevoke.amount = activeValue.toFixed();
                    const transaction = await client.contracts[Contracts.ELECTION].revokeActive(
                        txRevoke,
                        indexForGroup
                    );

                    if (transaction) {
                        transaction.additionalInfo.validatorName = validator.name;
                        transaction.nonce = transaction.nonce + transactions.length;
                        transactions.push(transaction);
                    }
                }

                break;
            }
            case PosBasicActionType.WITHDRAW: {
                const txWithdraw = cloneDeep(tx);
                const transaction = await client.contracts[Contracts.LOCKED_GOLD].withdraw(
                    txWithdraw,
                    txWithdraw.extraFields.witdrawIndex
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
