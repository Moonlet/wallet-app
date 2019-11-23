import { IAccountState } from '../../../redux/wallets/state';
import { BigNumber } from 'bignumber.js';
import { IResultValidation } from '../../wallet/types';

export interface IBlockchainAccountUtils {
    isValidChecksumAddress(address: string): boolean;
    isValidAddress(address: string): IResultValidation;

    publicToAddress(publicKey: string): string;
    privateToAddress(privateKey: string): string;
    privateToPublic(privateKey: string): string;

    getAccountFromPrivateKey(privateKey: string, index: number): IAccountState;

    amountToStd(value: BigNumber | number | string): BigNumber;
    amountFromStd(value: BigNumber): BigNumber;
    convertToGasPriceUnit(value: BigNumber): BigNumber;
    convertFromGasPriceUnit(value: BigNumber): BigNumber;
}
