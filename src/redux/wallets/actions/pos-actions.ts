import { IAccountState } from '../state';
import {
    IFeeOptions,
    ITransactionExtraFields
    // TransactionMessageType,
    // TransactionMessageText,
    // IBlockchainTransaction
} from '../../../core/blockchain/types';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { Dispatch } from 'react';
import { IAction } from '../../types';
import { IReduxState } from '../../state';
import { getChainId } from '../../preferences/selectors';
import { getSelectedWallet } from '../selectors';
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
    updateProcessTransactionStatusForIndex
} from '../../ui/process-transactions/actions';
import { TRANSACTION_PUBLISHED } from './wallet-actions';
import { TransactionStatus } from '../../../core/wallet/types';
import { cloneDeep } from 'lodash';
import {
    captureException as SentryCaptureException,
    addBreadcrumb as SentryAddBreadcrumb
} from '@sentry/react-native';

export const redelegate = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    password: string,
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
        password,
        navigation,
        extraFields,
        goBack,
        PosBasicActionType.REDELEGATE,
        sendResponse
    )(dispatch, getState);
};

export const claimRewardNoInput = (
    account: IAccountState,
    token: string,
    password: string,
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
        password,
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
    password: string,
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
        password,
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
    password: string,
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
        password,
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
    password: string,
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
        password,
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
    password: string,
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
        password,
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
    password: string,
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
        password,
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
    password: string,
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
        password,
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
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    type: PosBasicActionType,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    const appWallet = getSelectedWallet(state);

    try {
        const extra: ITransactionExtraFields = {
            ...extraFields,
            posAction: type
        };

        const wallet = await WalletFactory.get(appWallet.id, appWallet.type, {
            pass: password,
            deviceVendor: appWallet.hwOptions?.deviceVendor,
            deviceModel: appWallet.hwOptions?.deviceModel,
            deviceId: appWallet.hwOptions?.deviceId,
            connectionType: appWallet.hwOptions?.connectionType
        }); // encrypted string: pass)
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

        dispatch(setProcessTransactions(cloneDeep(txs)));

        for (let index = 0; index < txs.length; index++) {
            const client = getBlockchain(account.blockchain).getClient(chainId);
            const transaction = await wallet.sign(account.blockchain, account.index, txs[index]);
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
                dispatch(updateProcessTransactionStatusForIndex(index, TransactionStatus.PENDING));
            } else {
                SentryAddBreadcrumb({
                    message: JSON.stringify({ transactions: txs[index] })
                });

                dispatch(updateProcessTransactionStatusForIndex(index, TransactionStatus.FAILED));
                for (let i = index + 1; i < txs.length; i++) {
                    dispatch(updateProcessTransactionStatusForIndex(i, TransactionStatus.DROPPED));
                }
                break;
            }
        }
    } catch (errorMessage) {
        SentryCaptureException(new Error(JSON.stringify(errorMessage)));
        await LoadingModal.close();
        Dialog.info(translate('LoadingModal.txFailed'), translate('LoadingModal.GENERIC_ERROR'));
    }
};
