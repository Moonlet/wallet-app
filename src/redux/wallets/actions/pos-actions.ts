import { AccountType, IAccountState } from '../state';
import {
    Blockchain,
    IBlockchainTransaction,
    IFeeOptions,
    ITransactionExtraFields,
    TransactionMessageText
} from '../../../core/blockchain/types';
import { NavigationParams } from 'react-navigation';
import { Dispatch } from 'react';
import { IAction } from '../../types';
import { IReduxState } from '../../state';
import { getChainId } from '../../preferences/selectors';
import { getNrPendingTransactions, getSelectedAccount, getSelectedWallet } from '../selectors';
import { WalletFactory } from '../../../core/wallet/wallet-factory';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { generateAccountTokenState, getTokenConfig } from '../../tokens/static-selectors';
import { TRANSACTION_PUBLISHED } from '../actions';
import { translate } from '../../../core/i18n';
import { Dialog } from '../../../components/dialog/dialog';
import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { IValidator } from '../../../core/blockchain/types/stats';
import {
    openProcessTransactions,
    setProcessTransactions,
    updateProcessTransactionIdForIndex,
    updateProcessTransactionStatusForIndex,
    setProcessTxIndex,
    setProcessTxCompleted,
    closeProcessTransactions
} from '../../ui/process-transactions/actions';
import { TransactionStatus, WalletType } from '../../../core/wallet/types';
import { cloneDeep } from 'lodash';
import {
    captureException as SentryCaptureException,
    addBreadcrumb as SentryAddBreadcrumb
} from '@sentry/react-native';
import { LedgerConnect } from '../../../screens/ledger/ledger-connect';
import { PasswordModal } from '../../../components/password-modal/password-modal';
import { delay } from '../../../core/utils/time';
import { NearFunctionCallMethods } from '../../../core/blockchain/near/types';
import { NavigationService } from '../../../navigation/navigation-service';
import BigNumber from 'bignumber.js';

export const redelegate = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        validators,
        token,
        feeOptions,
        extraFields,
        goBack,
        PosBasicActionType.REDELEGATE,
        sendResponse
    )(dispatch, getState);
};

export const claimRewardNoInput = (
    account: IAccountState,
    validators: IValidator[],
    token: string,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    if (getNrPendingTransactions(getState())) {
        const nvServiceFn =
            NavigationService.getCurrentRoute() === 'Dashboard' ? 'navigate' : 'replace';
        Dialog.alert(
            translate('Validator.cannotInitiateTxTitle'),
            translate('Validator.cannotInitiateTxMessage'),
            undefined,
            {
                text: translate('App.labels.ok'),
                onPress: () => NavigationService[nvServiceFn]('TransactonsHistory', {})
            }
        );
    } else {
        posAction(
            account,
            undefined,
            validators,
            token,
            undefined,
            extraFields,
            goBack,
            PosBasicActionType.CLAIM_REWARD_NO_INPUT,
            sendResponse
        )(dispatch, getState);
    }
};

export const delegate = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        validators,
        token,
        feeOptions,
        extraFields,
        goBack,
        PosBasicActionType.DELEGATE,
        sendResponse
    )(dispatch, getState);
};

export const unstake = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        validators,
        token,
        feeOptions,
        extraFields,
        goBack,
        PosBasicActionType.UNSTAKE,
        sendResponse
    )(dispatch, getState);
};

export const unlock = (
    account: IAccountState,
    amount: string,
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        [],
        token,
        feeOptions,
        extraFields,
        goBack,
        PosBasicActionType.UNLOCK,
        sendResponse
    )(dispatch, getState);
};

export const activate = (
    account: IAccountState,
    token: string,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        undefined,
        undefined,
        token,
        undefined,
        extraFields,
        goBack,
        PosBasicActionType.ACTIVATE,
        sendResponse
    )(dispatch, getState);
};

export const withdraw = (
    account: IAccountState,
    validators: IValidator[],
    token: string,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    if (getNrPendingTransactions(getState())) {
        const nvServiceFn =
            NavigationService.getCurrentRoute() === 'Dashboard' ? 'navigate' : 'replace';
        Dialog.alert(
            translate('Validator.cannotInitiateTxTitle'),
            translate('Validator.cannotInitiateTxMessage'),
            undefined,
            {
                text: translate('App.labels.ok'),
                onPress: () => NavigationService[nvServiceFn]('TransactonsHistory', {})
            }
        );
    } else {
        posAction(
            account,
            undefined,
            validators,
            token,
            undefined,
            extraFields,
            goBack,
            PosBasicActionType.WITHDRAW,
            sendResponse
        )(dispatch, getState);
    }
};

export const unvote = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        validators,
        token,
        feeOptions,
        extraFields,
        goBack,
        PosBasicActionType.UNVOTE,
        sendResponse
    )(dispatch, getState);
};

export const posAction = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    type: PosBasicActionType,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    try {
        const extra: ITransactionExtraFields = {
            ...extraFields,
            posAction: type
        };
        const blockchainInstance = getBlockchain(account.blockchain);

        const tokenConfig = getTokenConfig(account.blockchain, token);

        dispatch(openProcessTransactions());

        const txs = await blockchainInstance.transaction.buildPosTransaction(
            {
                chainId,
                account,
                validators,
                amount: blockchainInstance.account
                    .amountToStd(amount, tokenConfig.decimals)
                    .toFixed(0, BigNumber.ROUND_DOWN),
                token,
                feeOptions:
                    feeOptions?.gasPrice && feeOptions?.gasLimit
                        ? {
                              gasPrice: feeOptions.gasPrice.toString(),
                              gasLimit: feeOptions.gasLimit.toString()
                          }
                        : undefined,
                extraFields: extra
            },
            type
        );
        dispatch(
            setProcessTransactions(
                cloneDeep(txs).map(tx => {
                    tx.status = TransactionStatus.CREATED;
                    return tx;
                })
            )
        );
    } catch (errorMessage) {
        SentryCaptureException(new Error(JSON.stringify(errorMessage)));
    }
};

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
                transaction: IBlockchainTransaction
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
                const currentBlockchainNonce = await client.getNonce(
                    account.type === AccountType.LOCKUP_CONTRACT
                        ? account.meta.owner
                        : account.address,
                    account.publicKey
                );
                const nrPendingTransactions = getNrPendingTransactions(getState());
                transaction = {
                    ...transaction,
                    nonce: currentBlockchainNonce + nrPendingTransactions
                };

                // console.log('updated', updatedTransaction);
                // return;

                signed = await wallet.sign(transaction.blockchain, account.index, transaction);
                dispatch(updateProcessTransactionStatusForIndex(txIndex, TransactionStatus.SIGNED));
            } catch (e) {
                if (e === 'LEDGER_SIGN_CANCELLED') {
                    dispatch(setProcessTxIndex(txIndex - 1));
                }
                throw e;
            }

            try {
                // const txHash = signed;
                // console.log(client);
                const txHash = await client.sendTransaction(signed);

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

        // console.log({ specificIndex, transactionLength: transactions.length });
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

        // console.log('PosActions:sign()', errorMessage);
        if (errorMessage !== 'LEDGER_SIGN_CANCELLED') {
            if (TransactionMessageText[errorMessage]) {
                Dialog.alert(
                    translate('LoadingModal.txFailed'),
                    translate(`LoadingModal.${errorMessage}`),
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

export const buildDummyValidator = (id: string, name?: string): IValidator => {
    return {
        id,
        name: name || id,
        icon: '',
        rank: '',
        totalVotes: '0',
        amountDelegated: {
            active: '0',
            pending: '0'
        },
        website: '',
        topStats: [],
        secondaryStats: [],
        chartStats: []
    };
};
