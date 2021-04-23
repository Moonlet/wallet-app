export * from './solana';
import { IAccountState } from '../../state';
import { IFeeOptions, ITransactionExtraFields } from '../../../../core/blockchain/types';
import { Dispatch } from 'react';
import { IAction } from '../../../types';
import { IReduxState } from '../../../state';
import { getChainId } from '../../../preferences/selectors';
import { getNrPendingTransactions } from '../../selectors';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../../tokens/static-selectors';
import { translate } from '../../../../core/i18n';
import { Dialog } from '../../../../components/dialog/dialog';
import { PosBasicActionType } from '../../../../core/blockchain/types/token';
import { IValidator } from '../../../../core/blockchain/types/stats';
import {
    openProcessTransactions,
    setProcessTransactions
} from '../../../ui/process-transactions/actions';
import { TransactionStatus } from '../../../../core/wallet/types';
import { cloneDeep } from 'lodash';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { NavigationService } from '../../../../navigation/navigation-service';
import BigNumber from 'bignumber.js';
import { isFeatureActive, RemoteFeature } from '../../../../core/utils/remote-feature-config';

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
    if (!isFeatureActive(RemoteFeature.IMPROVED_NONCE) && getNrPendingTransactions(getState())) {
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

export const delegateV2 = (
    account: IAccountState,
    validators: {
        validator: IValidator;
        amount: string;
    }[],
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posActionV2(
        account,
        validators,
        token,
        feeOptions,
        extraFields,
        PosBasicActionType.DELEGATE_V2
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
    if (!isFeatureActive(RemoteFeature.IMPROVED_NONCE) && getNrPendingTransactions(getState())) {
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

export const posActionV2 = (
    account: IAccountState,
    validators: {
        validator: IValidator;
        amount: string;
    }[],
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields,
    type: PosBasicActionType
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    try {
        const extra: ITransactionExtraFields = {
            ...extraFields,
            posAction: type
        };
        const blockchainInstance = getBlockchain(account.blockchain);

        dispatch(openProcessTransactions());

        const txs = await blockchainInstance.transaction.buildPosTransaction(
            {
                chainId,
                account,
                validators: validators as any,
                amount: '0',
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
