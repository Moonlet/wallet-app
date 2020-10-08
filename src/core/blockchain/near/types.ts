import BigNumber from 'bignumber.js';
import { PosBasicActionType } from '../types/token';

export enum NearTransactionActionType {
    TRANSFER = 'TRANSFER',
    FUNCTION_CALL = 'FUNCTION_CALL'
}

export enum NearFunctionCallMethods {
    DEPOSIT = 'deposit',
    STAKE = 'stake',
    UNSTAKE = 'unstake',
    WITHDRAW = 'withdraw',
    SEND = 'send',
    CREATE_ACCOUNT_AND_CLAIM = 'create_account_and_claim',
    DEPOSIT_AND_STAKE = 'deposit_and_stake',
    SELECT_STAKING_POOL = 'select_staking_pool',
    STAKE_ALL = 'stake_all'
}

export interface INearTransactionAction {
    type: NearTransactionActionType;
    params?: any[];
}

export interface INearTransactionAdditionalInfoType {
    currentBlockHash: string;
    actions: INearTransactionAction[];
    posAction?: PosBasicActionType;
    validatorName?: string;
}

export enum NearAccountType {
    DEFAULT = 'DEFAULT',
    CONTRACT = 'CONTRACT'
}

export interface INearAccount {
    address: string;
    name: string;
    amount: BigNumber;
    exists: boolean;
    valid: boolean;
    type?: NearAccountType;
}

export enum NearQueryRequestTypes {
    CALL_FUNCTION = 'call_function',
    VIEW_ACCOUNT = 'view_account',
    VIEW_ACCESS_KEY = 'view_access_key'
}

export enum NearAccountViewMethods {
    GET_OWNER_ACCOUNT_ID = 'get_owner_account_id',
    GET_STAKING_POOL_ACCOUNT_ID = 'get_staking_pool_account_id',
    GET_ACCOUNT_UNSTAKED_BALANCE = 'get_account_unstaked_balance'
}
