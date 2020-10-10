import { IAccountState } from '../state';
import {
    Blockchain,
    IBlockchainTransaction,
    IFeeOptions,
    ITransactionExtraFields,
    TransactionMessageText
} from '../../../core/blockchain/types';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Dispatch } from 'react';
import { IAction } from '../../types';
import { IReduxState } from '../../state';
import { getChainId } from '../../preferences/selectors';
import { getSelectedAccount, getSelectedWallet } from '../selectors';
import { LoadingModal } from '../../../components/loading-modal/loading-modal';
import { WalletFactory } from '../../../core/wallet/wallet-factory';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../tokens/static-selectors';
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
    setProcessTxCompleted
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

export const redelegate = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    navigation: NavigationScreenProp<NavigationState>,
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
        navigation,
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
    navigation: NavigationScreenProp<NavigationState>,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        undefined,
        validators,
        token,
        undefined,
        navigation,
        extraFields,
        goBack,
        PosBasicActionType.CLAIM_REWARD_NO_INPUT,
        sendResponse
    )(dispatch, getState);
};

export const delegate = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    navigation: NavigationScreenProp<NavigationState>,
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
        navigation,
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
    navigation: NavigationScreenProp<NavigationState>,
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
        navigation,
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
    navigation: NavigationScreenProp<NavigationState>,
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
        navigation,
        extraFields,
        goBack,
        PosBasicActionType.UNLOCK,
        sendResponse
    )(dispatch, getState);
};

export const activate = (
    account: IAccountState,
    token: string,
    navigation: NavigationScreenProp<NavigationState>,
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
        navigation,
        extraFields,
        goBack,
        PosBasicActionType.ACTIVATE,
        sendResponse
    )(dispatch, getState);
};

export const withdraw = (
    account: IAccountState,
    token: string,
    navigation: NavigationScreenProp<NavigationState>,
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
        navigation,
        extraFields,
        goBack,
        PosBasicActionType.WITHDRAW,
        sendResponse
    )(dispatch, getState);
};

export const unvote = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    navigation: NavigationScreenProp<NavigationState>,
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
        navigation,
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
    navigation: NavigationScreenProp<NavigationState>,
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
                    .toFixed(),
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

export const signAndSendTransactions = (
    transactions: IBlockchainTransaction[],
    specificIndex?: number
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();

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
        const wallet = await WalletFactory.get(appWallet.id, appWallet.type, {
            pass: password,
            deviceVendor: appWallet.hwOptions?.deviceVendor,
            deviceModel: appWallet.hwOptions?.deviceModel,
            deviceId: appWallet.hwOptions?.deviceId,
            connectionType: appWallet.hwOptions?.connectionType
        }); // encrypted string: pass)

        if (appWallet.type === WalletType.HW) {
            await LedgerConnect.signTransaction(
                account.blockchain,
                appWallet.hwOptions?.deviceModel,
                appWallet.hwOptions?.connectionType,
                appWallet.hwOptions?.deviceId
            );
        }

        const client = getBlockchain(account.blockchain).getClient(chainId);
        let error = false;
        for (let index = 0; index < transactions.length; index++) {
            if (error) break;
            const txIndex = specificIndex || index;
            const transaction = transactions[index];

            dispatch(setProcessTxIndex(txIndex));
            // await delay(5000);
            const signed = await wallet.sign(transaction.blockchain, account.index, transaction);
            dispatch(updateProcessTransactionStatusForIndex(txIndex, TransactionStatus.SIGNED));

            if (appWallet.type === WalletType.HW) {
                await LedgerConnect.close();
            }

            try {
                await delay(500);

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
        if (appWallet.type === WalletType.HD) {
            await LoadingModal.close();
        } else {
            await LedgerConnect.close();
        }

        if (TransactionMessageText[errorMessage]) {
            Dialog.info(
                translate('LoadingModal.txFailed'),
                translate(`LoadingModal.${errorMessage}`)
            );
        } else {
            Dialog.info(
                translate('LoadingModal.txFailed'),
                translate('LoadingModal.GENERIC_ERROR')
            );
        }
    }
};
