import { IAccountState } from '../../../redux/wallets/state';
import { Blockchain } from '.';
import { ITokenConfig } from './token';
import { TransactionStatus } from '../../wallet/types';
import BigNumber from 'bignumber.js';

export interface IBlockchainTransactionUtils {
    sign(
        transaction: IBlockchainTransaction<IAdditionalInfoType>,
        privateKey: string
    ): Promise<string>;
    buildTransferTransaction(tx: ITransferTransaction): IBlockchainTransaction<IAdditionalInfoType>;
}

// tslint:disable-next-line:no-shadowed-variable
export interface IBlockchainTransaction<IAdditionalInfoType = {}> {
    id?: string;
    date: {
        created: number;
        signed: number;
        broadcasted: number;
        confirmed: number;
    };
    blockchain: Blockchain;
    chainId: number;
    type: TransactionType;
    token?: ITokenConfig;

    address: string;
    publicKey: string;

    toAddress: string;
    amount: string;
    data?: {
        method?: string;
        params?: string[];
        raw: string;
    };
    feeOptions: IFeeOptions;
    broadcatedOnBlock: number;
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
        cheap: BigNumber;
        standard: BigNumber;
        fast: BigNumber;
        fastest: BigNumber;
    };
}

export interface ITransferTransaction {
    account: IAccountState;
    chainId: number; // needed???
    toAddress: string;
    amount: string;
    token: string;
    nonce: number;
    feeOptions: IFeeOptions;
    extraFields?: ITransferTransactionExtraFields;
}

export interface ITransferTransactionExtraFields {
    memo?: string;
    //
}

export interface IAdditionalInfoType {
    data?: string; // for Eth erc-20 sign
}
