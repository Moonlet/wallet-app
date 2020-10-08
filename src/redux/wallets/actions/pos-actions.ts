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
    updateProcessTransactionStatusForIndex
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
        for (let index = 0; index < transactions.length; index++) {
            const transaction = transactions[index];

            const signed = await wallet.sign(transaction.blockchain, account.index, transaction);

            try {
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
                    dispatch(updateProcessTransactionIdForIndex(specificIndex || index, txHash));
                    dispatch({
                        type: TRANSACTION_PUBLISHED,
                        data: {
                            hash: txHash,
                            tx: transaction,
                            walletId: appWallet.id
                        }
                    });
                    dispatch(
                        updateProcessTransactionStatusForIndex(
                            specificIndex || index,
                            TransactionStatus.PENDING
                        )
                    );

                    if (appWallet.type === WalletType.HW) {
                        await LedgerConnect.close();
                    }
                } else {
                    if (appWallet.type === WalletType.HW) {
                        await LedgerConnect.close();
                    }
                    SentryAddBreadcrumb({
                        message: JSON.stringify({ transactions: transaction })
                    });

                    dispatch(
                        updateProcessTransactionStatusForIndex(
                            specificIndex || index,
                            TransactionStatus.FAILED
                        )
                    );
                }
            } catch (error) {
                dispatch(
                    updateProcessTransactionStatusForIndex(
                        specificIndex || index,
                        TransactionStatus.FAILED
                    )
                );

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
