import BigNumber from 'bignumber.js';
import { PosBasicActionType } from '../types/token';

export enum NearTransactionActionType {
    TRANSFER = 'TRANSFER',
    FUNCTION_CALL = 'FUNCTION_CALL'
}

export interface INearTransactionAction {
    type: NearTransactionActionType;
    params?: [];
}

export interface INearTransactionAdditionalInfoType {
    currentBlockHash: string;
    actions: INearTransactionAction[];
    posAction?: PosBasicActionType;
    validatorName?: string;
}

export interface INearAccount {
    address: string;
    name: string;
    amount: BigNumber;
    exists: boolean;
    valid: boolean;
}
