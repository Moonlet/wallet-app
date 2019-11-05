import { GenericBlockchain } from './generic-blockchain';
import { getPubKeyFromPrivateKey, getAddressFromPrivateKey } from '@zilliqa-js/crypto/dist/util'; // import like this to optimize imports
import { toBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { isBech32 } from '@zilliqa-js/util/dist/validation';

import { Blockchain } from './types';
import { IAccountState } from '../../redux/wallets/state';

export class Zilliqa extends GenericBlockchain {
    public readonly DERIVATION_PATH: string = "m/44'/313'/0'/0";

    public getAccountFromPrivateKey(privateKey: string, index: number): IAccountState {
        return {
            index,
            publicKey: getPubKeyFromPrivateKey(privateKey),
            address: toBech32Address(getAddressFromPrivateKey(privateKey)),
            blockchain: Blockchain.ZILLIQA
        };
    }

    public getBalance(address: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
    public sendTransaction(): Promise<any> {
        throw new Error('Method not implemented.');
    }

    public isValidAddress(address: string): boolean {
        return isBech32(address);
    }

    public getFeeForAmount(amount: string): string {
        return '0.001';
    }
}
