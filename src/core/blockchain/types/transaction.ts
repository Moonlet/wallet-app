import { IAccountState } from '../../../redux/wallets/state';
import { Blockchain, ChainIdType } from '.';
import { TransactionStatus } from '../../wallet/types';
import BigNumber from 'bignumber.js';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { PosBasicActionType } from './token';

export interface IBlockchainTransactionUtils {
    sign(transaction: IBlockchainTransaction, privateKey: string): Promise<string>;
    buildTransferTransaction(tx: ITransferTransaction): Promise<IBlockchainTransaction>;
    getTransactionAmount(tx: IBlockchainTransaction): string;
    getTransactionStatusByCode(status: any): TransactionStatus;
    buildPosTransaction(
        tx: IPosTransaction,
        transactionType: PosBasicActionType
    ): Promise<IBlockchainTransaction[]>;
}

// tslint:disable-next-line:no-shadowed-variable
export interface IBlockchainTransaction<IAdditionalInfoType = any> {
    id?: string;
    date: {
        created: number;
        signed: number;
        broadcasted: number;
        confirmed: number;
    };
    blockchain: Blockchain;
    chainId: ChainIdType;
    type: TransactionType;
    token?: ITokenConfigState;
    address: string;
    publicKey: string;
    toAddress: string;
    amount: string;
    data?: {
        method?: string;
        params?: string[];
        raw?: string;
    };
    feeOptions: IFeeOptions;
    broadcastedOnBlock: number;
    nonce: number;
    status: TransactionStatus;
    additionalInfo?: IAdditionalInfoType;
}

export enum TransactionType {
    TRANSFER = 'TRANSFER',
    CONTRACT_CALL = 'CONTRACT_CALL'
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
    chainId: ChainIdType; // needed???
    amount: string;
    token: string;

    //  nonce: number;
    feeOptions: IFeeOptions;
    //  currentBlockHash: string;
    //  currentBlockNumber: number;
    extraFields?: ITransferTransactionExtraFields;
}

export interface ITransferTransaction {
    account: IAccountState;
    chainId: ChainIdType; // needed???
    toAddress: string;
    amount: string;
    token: string;
    //  nonce: number;
    feeOptions: IFeeOptions;
    //  currentBlockHash: string;
    //  currentBlockNumber: number;
    extraFields?: ITransferTransactionExtraFields;
}

export interface ITransferTransactionExtraFields {
    memo?: string;
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
    WAITING_TX_CONFIRM_CANCEL = 'WAITING_TX_CONFIRM_CANCEL'
}
