import { IAccountState } from '../state';
import {
    IBlockchainTransaction,
    IFeeOptions,
    ITransactionExtraFields,
    TransactionMessageText
    // TransactionMessageType,
    // TransactionMessageText,
    // IBlockchainTransaction
} from '../../../core/blockchain/types';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Dispatch } from 'react';
import { IAction } from '../../types';
import { IReduxState } from '../../state';
import { getChainId } from '../../preferences/selectors';
import { getSelectedAccount, getSelectedWallet } from '../selectors';
import { LoadingModal } from '../../../components/loading-modal/loading-modal';
// import { WalletType } from '../../../core/wallet/types';
import { WalletFactory } from '../../../core/wallet/wallet-factory';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../tokens/static-selectors';
// import { LedgerWallet } from '../../../core/wallet/hw-wallet/ledger/ledger-wallet';
// import { TRANSACTION_PUBLISHED } from '../actions';
import { translate } from '../../../core/i18n';
import { Dialog } from '../../../components/dialog/dialog';
import { PosBasicActionType } from '../../../core/blockchain/types/token';
import { IValidator } from '../../../core/blockchain/types/stats';
import {
    openProcessTransactions,
    setProcessTransactions,
    updateProcessTransactionIdForIndex,
    updateProcessTransactionSignatureForIndex,
    updateProcessTransactionStatusForIndex
} from '../../ui/process-transactions/actions';
import { TRANSACTION_PUBLISHED } from './wallet-actions';
import { TransactionStatus, WalletType } from '../../../core/wallet/types';
import { cloneDeep } from 'lodash';
import {
    captureException as SentryCaptureException,
    addBreadcrumb as SentryAddBreadcrumb
} from '@sentry/react-native';
import { LedgerConnect } from '../../../screens/ledger/ledger-connect';
import { PasswordModal } from '../../../components/password-modal/password-modal';

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

    const appWallet = getSelectedWallet(state);
    let password = '';
    try {
        if (appWallet.type === WalletType.HD) {
            password = await PasswordModal.getPassword(
                translate('Password.pinTitleUnlock'),
                translate('Password.subtitleSignTransaction'),
                { sensitive: true, showCloseButton: true }
            );
        }

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
                feeOptions: feeOptions
                    ? {
                          gasPrice: feeOptions.gasPrice.toString(),
                          gasLimit: feeOptions.gasLimit.toString()
                      }
                    : undefined,
                extraFields: extra
            },
            type
        );

        const unsignedTransactions = [];
        txs.map(tx => {
            const txUnsigned = {
                transaction: tx,
                signature: undefined
            };
            unsignedTransactions.push(txUnsigned);
        });

        dispatch(setProcessTransactions(cloneDeep(unsignedTransactions)));

        return;

        const wallet = await WalletFactory.get(appWallet.id, appWallet.type, {
            pass: password,
            deviceVendor: appWallet.hwOptions?.deviceVendor,
            deviceModel: appWallet.hwOptions?.deviceModel,
            deviceId: appWallet.hwOptions?.deviceId,
            connectionType: appWallet.hwOptions?.connectionType
        }); // encrypted string: pass)

        for (let index = 0; index < txs.length; index++) {
            const client = getBlockchain(account.blockchain).getClient(chainId);

            if (appWallet.type === WalletType.HW) {
                await LedgerConnect.signTransaction(
                    account.blockchain,
                    appWallet.hwOptions?.deviceModel,
                    appWallet.hwOptions?.connectionType,
                    appWallet.hwOptions?.deviceId
                );
            }

            const transaction = await wallet.sign(account.blockchain, account.index, txs[index]);

            try {
                const txHash = await client.sendTransaction(transaction);

                if (txHash) {
                    dispatch(updateProcessTransactionIdForIndex(index, txHash));
                    dispatch({
                        type: TRANSACTION_PUBLISHED,
                        data: {
                            hash: txHash,
                            tx: txs[index],
                            walletId: appWallet.id
                        }
                    });
                    dispatch(
                        updateProcessTransactionStatusForIndex(index, TransactionStatus.PENDING)
                    );

                    if (appWallet.type === WalletType.HW) {
                        await LedgerConnect.close();
                    }
                } else {
                    if (appWallet.type === WalletType.HW) {
                        await LedgerConnect.close();
                    }
                    SentryAddBreadcrumb({
                        message: JSON.stringify({ transactions: txs[index] })
                    });

                    dispatch(
                        updateProcessTransactionStatusForIndex(index, TransactionStatus.FAILED)
                    );
                    for (let i = index + 1; i < txs.length; i++) {
                        dispatch(
                            updateProcessTransactionStatusForIndex(i, TransactionStatus.DROPPED)
                        );
                    }
                    break;
                }
            } catch (error) {
                if (appWallet.type === WalletType.HW) {
                    await LedgerConnect.close();
                }
                dispatch(updateProcessTransactionStatusForIndex(index, TransactionStatus.FAILED));

                // TODO  we should stop all other transactions? if one fails?
                for (let i = index + 1; i < txs.length; i++) {
                    dispatch(updateProcessTransactionStatusForIndex(i, TransactionStatus.DROPPED));
                }
                throw error;
            }
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

export const signHWWalletTransaction = (
    transaction: IBlockchainTransaction,
    index: number
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();

    const appWallet = getSelectedWallet(state);
    const selectedAccount = getSelectedAccount(state); // Not sure its ok...
    try {
        const wallet = await WalletFactory.get(appWallet.id, appWallet.type, {
            pass: '',
            deviceVendor: appWallet.hwOptions?.deviceVendor,
            deviceModel: appWallet.hwOptions?.deviceModel,
            deviceId: appWallet.hwOptions?.deviceId,
            connectionType: appWallet.hwOptions?.connectionType
        }); // encrypted string: pass)

        await LedgerConnect.signTransaction(
            transaction.blockchain,
            appWallet.hwOptions?.deviceModel,
            appWallet.hwOptions?.connectionType,
            appWallet.hwOptions?.deviceId
        );

        const signed = await wallet.sign(
            transaction.blockchain,
            selectedAccount.index,
            transaction
        );

        // console.log('signed', signed);

        dispatch(updateProcessTransactionSignatureForIndex(index, signed));
        await LedgerConnect.close();
    } catch (errorMessage) {
        SentryCaptureException(new Error(JSON.stringify(errorMessage)));

        await LedgerConnect.close();
    }
};
