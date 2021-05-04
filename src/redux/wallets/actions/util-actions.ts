import { Dispatch } from 'react';
import { NavigationParams } from 'react-navigation';
import { TRANSACTION_PUBLISHED } from '.';
import { Dialog } from '../../../components/dialog/dialog';
import { PasswordModal } from '../../../components/password-modal/password-modal';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { NearFunctionCallMethods } from '../../../core/blockchain/near/types';
import {
    IBlockchainTransaction,
    Blockchain,
    TransactionMessageText
} from '../../../core/blockchain/types';
import { IValidator } from '../../../core/blockchain/types/stats';
import { translate } from '../../../core/i18n';
import { WalletType, TransactionStatus } from '../../../core/wallet/types';
import { WalletFactory } from '../../../core/wallet/wallet-factory';
import { NavigationService } from '../../../navigation/navigation-service';
import { LedgerConnect } from '../../../screens/ledger/ledger-connect';
import { getChainId } from '../../preferences/selectors';
import { IReduxState } from '../../state';
import { getTokenConfig, generateAccountTokenState } from '../../tokens/static-selectors';
import { IAction } from '../../types';
import { delay } from '../../../core/utils/time';
import {
    setProcessTxIndex,
    updateProcessTransactionStatusForIndex,
    updateProcessTransactionIdForIndex,
    setProcessTxCompleted,
    closeProcessTransactions,
    updateProcessTransactionConfirmationsForIndex
} from '../../ui/process-transactions/actions';
import {
    getSelectedWallet,
    getSelectedAccount,
    getNrPendingTransactions,
    getSelectedAccountTransactions
} from '../selectors';
import { AccountType } from '../state';
import {
    captureException as SentryCaptureException,
    addBreadcrumb as SentryAddBreadcrumb
} from '@sentry/react-native';
import { isFeatureActive, RemoteFeature } from '../../../core/utils/remote-feature-config';

export const signAndSendTransactions = (specificIndex?: number) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const state = getState();

    const transactions: IBlockchainTransaction[] = state.ui.processTransactions.data.txs;

    const appWallet = getSelectedWallet(state);
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);
    let password = '';
    try {
        if (appWallet.type === WalletType.HD) {
            password = await PasswordModal.getPassword(
                translate('Password.pinTitleUnlock'),
                translate('Password.subtitleSignTransaction'),
                { sensitive: true, showCloseButton: true }
            );
        }

        const wallet: {
            sign: (
                blockchain: Blockchain,
                accountIndex: number,
                transaction: IBlockchainTransaction,
                accountType: AccountType
            ) => Promise<any>;
        } =
            appWallet.type === WalletType.HW
                ? LedgerConnect
                : await WalletFactory.get(appWallet.id, appWallet.type, {
                      pass: password,
                      deviceVendor: appWallet.hwOptions?.deviceVendor,
                      deviceModel: appWallet.hwOptions?.deviceModel,
                      deviceId: appWallet.hwOptions?.deviceId,
                      connectionType: appWallet.hwOptions?.connectionType
                  }); // encrypted string: pass)

        const client = getBlockchain(account.blockchain).getClient(chainId);
        let error = false;
        const startIndex = specificIndex === undefined ? 0 : specificIndex;
        for (let index = startIndex; index < transactions.length; index++) {
            await delay(0);
            if (error) break;
            const txIndex = specificIndex || index;
            let transaction = transactions[index];

            dispatch(setProcessTxIndex(txIndex));
            let signed;
            try {
                let nonce = await client.getNonce(
                    account.type === AccountType.LOCKUP_CONTRACT
                        ? account.meta.owner
                        : account.address,
                    account.publicKey
                );
                const nrPendingTransactions = getNrPendingTransactions(getState());
                transaction = {
                    ...transaction,
                    nonce: nonce + nrPendingTransactions
                };

                if (isFeatureActive(RemoteFeature.IMPROVED_NONCE)) {
                    // Adjust nonce
                    const currentBlockNumber = await client
                        .getCurrentBlock()
                        .then(res => res.number);
                    // getting all outbound tx for current account
                    const outboundTransactions = getSelectedAccountTransactions(getState()).filter(
                        tx => tx.address === account.address
                    );

                    // checking if there are transactions with same nonce
                    let outTx: IBlockchainTransaction = outboundTransactions.find(
                        tx => tx.nonce === nonce
                    );
                    while (outTx) {
                        // found a tx with the same nonce
                        const txStatus = await client.utils.getTransactionStatus(outTx.id, {
                            broadcastedOnBlock: outTx.broadcastedOnBlock,
                            currentBlockNumber,
                            address: account.address
                        });

                        // if the status oif the tx is DROPPED we can reuse the nonce
                        if (txStatus === TransactionStatus.DROPPED) {
                            break;
                        } else {
                            // the transactions is not dropped, so it's on the chain, we need to increase the nonce and check again
                            nonce++;
                            outTx = outboundTransactions.find(tx => tx.nonce === nonce);
                        }
                    }
                    // updating the nonce
                    transaction.nonce = nonce;
                }

                signed = await wallet.sign(
                    transaction.blockchain,
                    account.index,
                    transaction,
                    account.type
                );
                dispatch(updateProcessTransactionStatusForIndex(txIndex, TransactionStatus.SIGNED));
            } catch (e) {
                if (e === 'LEDGER_SIGN_CANCELLED') {
                    dispatch(setProcessTxIndex(txIndex - 1));
                }
                throw e;
            }

            try {
                const { txHash } = await client.sendTransaction(signed);

                // SELECT_STAKING_POOL: delay 2 seconds
                // Needed only if there are multiple operations, such as select_staking_pool and deposit_and_stake
                // Need to increase the number of blocks between transactions
                const { additionalInfo } = transaction;
                if (
                    account.blockchain === Blockchain.NEAR &&
                    additionalInfo &&
                    transactions.length > 1
                ) {
                    for (const action of additionalInfo?.actions || []) {
                        if (action?.params[0] === NearFunctionCallMethods.SELECT_STAKING_POOL) {
                            await delay(2000);
                        }
                    }
                }

                if (txHash) {
                    dispatch(updateProcessTransactionIdForIndex(txIndex, txHash));
                    dispatch({
                        type: TRANSACTION_PUBLISHED,
                        data: {
                            hash: txHash,
                            tx: {
                                ...transaction,
                                status: TransactionStatus.PENDING
                            },
                            walletId: appWallet.id
                        }
                    });
                    dispatch(
                        updateProcessTransactionStatusForIndex(txIndex, TransactionStatus.PENDING)
                    );

                    if (transaction?.confirmations) {
                        await waitTransactionConfirmations(
                            txHash,
                            txIndex,
                            transaction,
                            account.address,
                            client,
                            dispatch,
                            getState
                        );
                    }
                } else {
                    SentryAddBreadcrumb({
                        message: JSON.stringify({ transactions: transaction })
                    });

                    error = true;
                    dispatch(setProcessTxCompleted(true, true));

                    dispatch(
                        updateProcessTransactionStatusForIndex(txIndex, TransactionStatus.FAILED)
                    );
                }
            } catch (err) {
                error = true;
                dispatch(setProcessTxCompleted(true, true));
                dispatch(updateProcessTransactionStatusForIndex(txIndex, TransactionStatus.FAILED));

                throw err;
            }

            if (specificIndex !== undefined) {
                // just stop, we had to sign only one tx (ledger)
                break;
            }
        }

        if (
            specificIndex === undefined ||
            (specificIndex !== undefined && specificIndex + 1 >= transactions.length)
        ) {
            // we need to check if all txs were signed before marking the flow complete.
            dispatch(setProcessTxCompleted(true, false));
        }
    } catch (errorMessage) {
        SentryCaptureException(new Error(JSON.stringify(errorMessage)));

        const atLeastOneTransactionBroadcasted = transactionsBroadcasted(
            getState().ui.processTransactions.data.txs
        );
        const tokenConfig = getTokenConfig(account.blockchain, transactions[0].token.symbol);
        const blockchainInstance = getBlockchain(account.blockchain);
        let navigationParams: NavigationParams = {
            blockchain: account.blockchain,
            accountIndex: account.index,
            token: generateAccountTokenState(tokenConfig),
            tokenLogo: tokenConfig.icon
        };
        if (atLeastOneTransactionBroadcasted) {
            navigationParams = {
                ...navigationParams,
                activeTab: blockchainInstance.config.ui?.token?.labels?.tabTransactions
            };
        }

        if (errorMessage !== 'LEDGER_SIGN_CANCELLED') {
            if (TransactionMessageText[errorMessage]) {
                Dialog.alert(
                    translate('LoadingModal.txFailed'),
                    translate(`LoadingModal.${errorMessage}`, {
                        coin: blockchainInstance.config.coin
                    }),
                    undefined,
                    {
                        text: translate('App.labels.ok'),
                        onPress: () => {
                            dispatch(closeProcessTransactions());
                            NavigationService.navigate('Token', navigationParams);
                        }
                    }
                );
            } else {
                Dialog.alert(
                    translate('LoadingModal.txFailed'),
                    translate('LoadingModal.GENERIC_ERROR'),
                    undefined,
                    {
                        text: translate('App.labels.ok'),
                        onPress: () => {
                            dispatch(closeProcessTransactions());
                            NavigationService.navigate('Token', navigationParams);
                        }
                    }
                );
            }
        }
    }
};

const waitTransactionConfirmations = async (
    txHash: string,
    txIndex: number,
    transaction: IBlockchainTransaction,
    address: string,
    client: any,
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    return new Promise((resolve, reject) => {
        const txWaitConfirmationsInterval = setInterval(async () => {
            const resConfirmations = await client.getTransactionConfirmations(txHash);

            dispatch(
                updateProcessTransactionConfirmationsForIndex(
                    txIndex,
                    resConfirmations.confirmations
                )
            );

            if (
                transaction.confirmations.numConfirmations ===
                transaction.confirmations.numConfirmationsNeeded
            ) {
                const tx = await client.utils.getTransaction(txHash, {
                    address
                });

                txWaitConfirmationsInterval && clearInterval(txWaitConfirmationsInterval);

                if (tx.status === TransactionStatus.SUCCESS) {
                    dispatch(
                        updateProcessTransactionStatusForIndex(txIndex, TransactionStatus.SUCCESS)
                    );
                    return resolve(true);
                }

                if (tx.status === TransactionStatus.FAILED) {
                    dispatch(
                        updateProcessTransactionStatusForIndex(txIndex, TransactionStatus.FAILED)
                    );
                    return reject();
                }
            }
        }, 1000);
    });
};

const transactionsBroadcasted = (txs: IBlockchainTransaction[]): boolean => {
    return (
        txs.filter(tx => {
            return (
                tx.status === TransactionStatus.FAILED ||
                tx.status === TransactionStatus.DROPPED ||
                tx.status === TransactionStatus.PENDING ||
                tx.status === TransactionStatus.SUCCESS
            );
        }).length > 0
    );
};

export const buildDummyValidator = (
    id: string,
    name?: string,
    icon?: string,
    website?: string,
    inputAmount?: string
): IValidator => {
    return {
        id,
        name: name || id,
        icon: icon || '',
        rank: '',
        totalVotes: '0',
        amountDelegated: {
            active: '0',
            pending: '0'
        },
        website: website || '',
        topStats: [],
        secondaryStats: [],
        chartStats: [],
        inputAmount
    };
};
