import { IAccountState } from '../../../redux/wallets/state';
import { Blockchain, ChainIdType } from '.';
import { TransactionStatus } from '../../wallet/types';
import BigNumber from 'bignumber.js';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { PosBasicActionType } from './token';
import { IValidator } from './stats';

export abstract class AbstractBlockchainTransactionUtils {
    public async sign(transaction: IBlockchainTransaction, privateKey: string): Promise<string> {
        throw new Error('Not Implemented');
    }
    public async signMessage(message: string, privateKey: string): Promise<string> {
        throw new Error('Not Implemented');
    }
    public async buildTransferTransaction(
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction> {
        throw new Error('Not Implemented');
    }
    public getTransactionAmount(tx: IBlockchainTransaction): string {
        throw new Error('Not Implemented');
    }
    public getTransactionStatusByCode(status: any): TransactionStatus {
        throw new Error('Not Implemented');
    }
    public async buildPosTransaction(
        tx: IPosTransaction,
        transactionType: PosBasicActionType
    ): Promise<IBlockchainTransaction[]> {
        throw new Error('Not Implemented');
    }
    public getMessageSignature(account: IAccountState, message: string, signature: string): any {
        throw new Error('Not Implemented');
    }
}

// tslint:disable-next-line:no-shadowed-variable
export interface IBlockchainTransaction<IAdditionalInfoType = any> {
    id?: string;
    walletPubKey?: string;
    date: {
        created: number;
        signed: number;
        broadcasted: number;
        confirmed: number;
    };
    blockchain: Blockchain;
    chainId: ChainIdType;
    type: TransactionType;
    token: ITokenConfigState;
    address: string;
    publicKey: string;
    toAddress: string;
    amount: string;
    data?: {
        method?: string;
        params?: string[];
        raw?: string;
    };
    code?: string;
    feeOptions: IFeeOptions;
    broadcastedOnBlock: number;
    nonce: number;
    status: TransactionStatus;
    additionalInfo?: IAdditionalInfoType;
    confirmations?: {
        numConfirmations: number; // current
        numConfirmationsNeeded: number; // target
    };
}

export enum TransactionType {
    TRANSFER = 'TRANSFER',
    CONTRACT_CALL = 'CONTRACT_CALL',
    CONTRACT_DEPLOY = 'CONTRACT_DEPLOY'
}

export interface IFeeOptions {
    gasPrice?: string;
    gasLimit?: string;
    feeTotal?: string;
    presets?: {
        cheap?: BigNumber;
        standard?: BigNumber;
        fast?: BigNumber;
        fastest?: BigNumber;
        low?: BigNumber;
        average?: BigNumber;
    };
}

export interface IPosTransaction {
    account: IAccountState;
    chainId: ChainIdType;
    validators: IValidator[];
    amount: string;
    token: string;
    feeOptions: IFeeOptions;
    extraFields?: ITransactionExtraFields;
}

export interface ITransferTransaction {
    account: IAccountState;
    chainId: ChainIdType;
    toAddress: string;
    amount: string;
    token: string;
    //  nonce: number;
    feeOptions: IFeeOptions;
    //  currentBlockHash: string;
    //  currentBlockNumber: number;
    extraFields?: ITransactionExtraFields;
}

export interface ITransactionExtraFields {
    memo?: string;
    witdrawIndex?: number;
    posAction?: PosBasicActionType;
    validatorId?: string;
    validatorName?: string;
    fromValidator?: IValidator;
    amount?: string;
    stakeAccountKey?: string;
    stakeAccountIndex?: number;
    splitFrom?: string;

    //
}

export enum TransactionMessageType {
    INFO = 'INFO',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    COMPONENT = 'COMPONENT'
}

export enum TransactionMessageText {
    REVIEW_TRANSACTION = 'REVIEW_TRANSACTION',
    OPEN_APP = 'OPEN_APP',
    SIGNING = 'SIGNING',
    CONNECTING_LEDGER = 'CONNECTING_LEDGER',
    BROADCASTING = 'BROADCASTING',
    TR_UNDERPRICED = 'TR_UNDERPRICED',
    NOT_ENOUGH_TOKENS = 'NOT_ENOUGH_TOKENS',
    CONTRACT_TX_NORMAL_NOT_ALLOWED = 'CONTRACT_TX_NORMAL_NOT_ALLOWED',
    WAITING_TX_CONFIRM = 'WAITING_TX_CONFIRM',
    WAITING_TX_CONFIRM_CANCEL = 'WAITING_TX_CONFIRM_CANCEL',
    INSUFFICIENT_FUNDS_SOURCE_ACCOUNT = 'INSUFFICIENT_FUNDS_SOURCE_ACCOUNT',
    GOVERNANCE_SIGN = 'GOVERNANCE_SIGN',
    GOVERNANCE_VOTING = 'GOVERNANCE_VOTING',
    GOVERNANCE_VOTED = 'GOVERNANCE_VOTED'
}
