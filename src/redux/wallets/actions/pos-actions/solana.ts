import { IAccountState } from '../../state';
import { IFeeOptions, ITransactionExtraFields } from '../../../../core/blockchain/types';
import { Dispatch } from 'react';
import { IAction } from '../../../types';
import { IReduxState } from '../../../state';
import { posActionV2, posAction } from '.';
import { IValidator } from '../../../../core/blockchain/types/stats';
import { PosBasicActionType } from '../../../../core/blockchain/types/token';

export const solanaDelegateStakeAccount = (
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
        PosBasicActionType.SOLANA_STAKEACCOUNT_DELEGATE
    )(dispatch, getState);
};

export const solanaCreateStakeAccount = (
    account: IAccountState,
    amount: string,
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        undefined,
        token,
        feeOptions,
        extraFields,
        undefined,
        PosBasicActionType.SOLANA_STAKEACCOUNT_CREATE
    )(dispatch, getState);
};

export const solanaSplitStakeAccount = (
    account: IAccountState,
    amount: string,
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        undefined,
        token,
        feeOptions,
        extraFields,
        undefined,
        PosBasicActionType.SOLANA_STAKEACCOUNT_SPLIT
    )(dispatch, getState);
};

export const solanaWithdraw = (
    account: IAccountState,
    amount: string,
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        undefined,
        token,
        feeOptions,
        extraFields,
        undefined,
        PosBasicActionType.SOLANA_STAKEACCOUNT_WITHDRAW
    )(dispatch, getState);
};

export const solanaUnstake = (
    account: IAccountState,
    amount: string,
    validators: IValidator[],
    token: string,
    feeOptions: IFeeOptions,
    extraFields: ITransactionExtraFields
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    posAction(
        account,
        amount,
        validators,
        token,
        feeOptions,
        extraFields,
        undefined,
        PosBasicActionType.SOLANA_STAKEACCOUNT_UNSTAKE
    )(dispatch, getState);
};

/**
 * Create stake account & Delegate
 */
export const solanaCreateAndDelegateStakeAccount = (
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
        PosBasicActionType.SOLANA_CREATE_AND_DELEGATE_STAKE_ACCOUNT
    )(dispatch, getState);
};
