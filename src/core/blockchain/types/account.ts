import { IAccountState } from '../../../redux/wallets/state';
import { BigNumber } from 'bignumber.js';

export interface IBlockchainAccountUtils {
    isValidChecksumAddress(address: string): boolean;
    isValidAddress(address: string): boolean;

    publicToAddress(publicKey: string): string;
    privateToAddress(privateKey: string): string;
    privateToPublic(privateKey: string): string;

    getAccountFromPrivateKey(privateKey: string, index: number): IAccountState;

    amountToStd(value: string): BigNumber;
    amountFromStd(value: BigNumber): BigNumber;
}
