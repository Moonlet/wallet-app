import { IAccountState, ITokenState } from '../../../redux/wallets/state';
import { BigNumber } from 'bignumber.js';
import { ChainIdType, IFeeOptions } from '.';
import { PosBasicActionType } from './token';

export interface IBlockchainAccountUtils {
    getAccountDerivationPath(accountIndex: number): string;
    getPrivateKeyFromDerived(derivedKey: any): string;
    isValidChecksumAddress(address: string): boolean;
    isValidAddress(address: string): boolean;

    publicToAddress(publicKey: string): string;
    privateToAddress(privateKey: string): string;
    privateToPublic(privateKey: string): string;

    getAccountFromPrivateKey(privateKey: string, index: number): IAccountState;

    amountToStd(value: BigNumber | number | string, decimals: number): BigNumber;
    amountFromStd(value: BigNumber, decimals: number): BigNumber;
    convertUnit(value: BigNumber, from: string, to: string): BigNumber;

    availableAmount(
        account: IAccountState,
        value: string,
        token: ITokenState,
        chainId: ChainIdType,
        options: { feeOptions?: IFeeOptions; action?: PosBasicActionType | 'transfer' }
    ): Promise<string>;
}
