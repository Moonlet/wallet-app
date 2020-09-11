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
    WITHDRAW = 'withdraw'
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
