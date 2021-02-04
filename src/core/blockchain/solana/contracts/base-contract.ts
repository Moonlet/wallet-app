import { IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { TransactionStatus } from '../../../wallet/types';
import { Client as SolanaClient } from '../client';
import { Solana } from '..';
import { IStakeAccountFormat } from '../types';
import { PosBasicActionType } from '../../types/token';
import CryptoJS from 'crypto-js';
import { encode as bs58Encode, decode as bs58Decode } from 'bs58';
import BigNumber from 'bignumber.js';

export const stakeProgramId = 'Stake11111111111111111111111111111111111111';
export const programId = '11111111111111111111111111111111111111';

export const buildBaseTransaction = async (
    tx: IPosTransaction
): Promise<IBlockchainTransaction> => {
    const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

    const client = Solana.getClient(tx.chainId) as SolanaClient;
    const nonce = 1;

    const blockHash = await client.getCurrentBlockHash();
    const blockInfo = await client.getCurrentBlock();

    return {
        date: {
            created: Date.now(),
            signed: Date.now(),
            broadcasted: Date.now(),
            confirmed: Date.now()
        },
        blockchain: tx.account.blockchain,
        chainId: tx.chainId,
        type: TransactionType.CONTRACT_CALL,
        token: tokenConfig,
        address: tx.account.address,
        publicKey: tx.account.publicKey,
        toAddress: '',
        amount: tx.amount,
        feeOptions: tx.feeOptions,
        broadcastedOnBlock: blockInfo?.number,
        nonce,
        status: TransactionStatus.PENDING,
        data: {},
        additionalInfo: {
            currentBlockHash: blockHash
        }
    };
};

function hash(h, v) {
    h.update(CryptoJS.lib.WordArray.create(Buffer.from(v)));
}

export const generateStakeAccount = (address: string, index: number): string => {
    const sha256 = CryptoJS.algo.SHA256.create();
    hash(sha256, bs58Decode(address));
    hash(sha256, `stake:${index}`);
    hash(sha256, bs58Decode(stakeProgramId));
    const pub = Buffer.from(sha256.finalize().toString(), 'hex');
    return bs58Encode(pub);
};

const stakeAccountWithExactAmount = (
    accounts: {
        [key: string]: IStakeAccountFormat;
    },
    action: PosBasicActionType,
    amount: string
): string => {
    const amountForAction: BigNumber = new BigNumber(amount);
    let stakeAccountAddress;

    Object.keys(accounts).map(address => {
        const account = accounts[address];
        switch (action) {
            case PosBasicActionType.DELEGATE:
                if (amountForAction.isEqualTo(account.unstaked)) stakeAccountAddress = address;
                break;
            case PosBasicActionType.UNSTAKE:
                if (
                    amountForAction.isEqualTo(new BigNumber(account.staked)) ||
                    amountForAction.isEqualTo(new BigNumber(account.activating))
                )
                    stakeAccountAddress = address;
                break;
        }
    });

    return stakeAccountAddress;
};

export const selectStakeAccounts = (
    baseAddress: string,
    accounts: {
        [key: string]: IStakeAccountFormat;
    },
    action: PosBasicActionType,
    amount: string,
    usedStakedAccounts: string[],
    validatorId?: string
): {
    [key: string]: {
        amount?: string;
        options?: {
            shouldCreate?: boolean;
            shouldSplit?: boolean;
            splitFrom?: string;
            index?: number;
        };
    };
} => {
    const selectedStakeAccounts = {};
    let amountForAction: BigNumber = new BigNumber(amount);

    switch (action) {
        case PosBasicActionType.DELEGATE:
            const stakeAccountKey = stakeAccountWithExactAmount(accounts, action, amount);

            if (stakeAccountKey) {
                selectedStakeAccounts[stakeAccountKey] = {
                    amount
                };
            } else {
                Object.keys(accounts).map(address => {
                    if (amountForAction.isGreaterThan(0) && !usedStakedAccounts.includes(address)) {
                        const account = accounts[address];
                        if (account.unstaked && new BigNumber(account.unstaked).isGreaterThan(0)) {
                            if (
                                new BigNumber(amountForAction).isGreaterThanOrEqualTo(
                                    account.unstaked
                                )
                            ) {
                                selectedStakeAccounts[address] = {
                                    amount: account.unstaked
                                };
                                amountForAction = amountForAction.minus(account.unstaked);
                            } else {
                                // split
                                const newIndex = Object.keys(accounts).length;
                                const newStakeAccountAddress = generateStakeAccount(
                                    baseAddress,
                                    newIndex
                                );
                                selectedStakeAccounts[newStakeAccountAddress] = {
                                    amount: amountForAction,
                                    options: {
                                        shouldSplit: true,
                                        splitFrom: address,
                                        index: newIndex
                                    }
                                };
                                amountForAction = new BigNumber(0);
                            }
                        }
                    }
                });
                if (amountForAction.isGreaterThan(0)) {
                    let newIndex;
                    let prevKey;
                    Object.keys(accounts).map(key => {
                        const currentObject = accounts[key];
                        if (prevKey) {
                            const prevObject = accounts[prevKey];
                            if (currentObject.index - prevObject.index !== 1) {
                                newIndex = currentObject.index - 1;
                            }
                        }
                        prevKey = key;
                    });

                    if (newIndex) {
                        const newStakeAccountAddress = generateStakeAccount(baseAddress, newIndex);
                        selectedStakeAccounts[newStakeAccountAddress] = {
                            amount: amountForAction,
                            options: { shouldCreate: true, index: newIndex }
                        };
                    }
                }
            }

            break;
        case PosBasicActionType.UNSTAKE:
            const stakeAccountAddress = stakeAccountWithExactAmount(accounts, action, amount);
            if (stakeAccountAddress) {
                selectedStakeAccounts[stakeAccountAddress] = {
                    amount
                };
            } else
                Object.keys(accounts).map(address => {
                    const account = accounts[address];

                    if (
                        amountForAction.isGreaterThan(0) &&
                        !usedStakedAccounts.includes(address) &&
                        account.validatorId === validatorId
                    ) {
                        if (account.staked && new BigNumber(account.staked).isGreaterThan(0)) {
                            if (
                                new BigNumber(amountForAction).isGreaterThanOrEqualTo(
                                    account.staked
                                )
                            ) {
                                selectedStakeAccounts[address] = {
                                    amount: account.staked
                                };
                                amountForAction = amountForAction.minus(account.staked);
                            } else {
                                const newIndex = Object.keys(accounts).length;
                                const newStakeAccountAddress = generateStakeAccount(
                                    baseAddress,
                                    newIndex
                                );
                                selectedStakeAccounts[newStakeAccountAddress] = {
                                    amount: amountForAction,
                                    options: {
                                        shouldSplit: true,
                                        splitFrom: address,
                                        index: newIndex
                                    }
                                };
                                amountForAction = new BigNumber(0);
                            }
                        } else if (
                            account.activating &&
                            new BigNumber(account.activating).isGreaterThan(0)
                        ) {
                            if (
                                new BigNumber(amountForAction).isGreaterThanOrEqualTo(
                                    account.activating
                                )
                            ) {
                                selectedStakeAccounts[address] = {
                                    amount: account.activating
                                };
                                amountForAction = amountForAction.minus(account.activating);
                            } else {
                                // split
                            }
                        }
                    }
                });
            break;
    }

    return selectedStakeAccounts;
};
