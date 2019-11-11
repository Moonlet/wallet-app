import { IAccountState } from '../../../redux/wallets/state';

export interface IBlockchainAccount {
    isValidChecksumAddress(address: string): boolean;
    isValidAddress(address: string): boolean;

    publicToAddress(publicKey: string): string;
    privateToAddress(privateKey: string): string;
    privateToPublic(privateKey: string): string;

    getAccountFromPrivateKey(privateKey: string, index: number): IAccountState;
}
