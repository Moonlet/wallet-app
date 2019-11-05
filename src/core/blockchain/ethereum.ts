import { GenericBlockchain } from './generic-blockchain';
import { Blockchain } from './types';
import * as Util from 'ethereumjs-util';
import { IAccountState } from '../../redux/wallets/state';

export class Ethereum extends GenericBlockchain {
    public readonly DERIVATION_PATH: string = "m/44'/60'/0'/0";

    public getAccountFromPrivateKey(privateKey: string, index: number): IAccountState {
        const privateKeyBuffer = Buffer.from(privateKey, 'hex');
        return {
            index,
            publicKey: Util.privateToPublic(privateKeyBuffer).toString('hex'),
            address: Util.toChecksumAddress(
                Util.privateToAddress(privateKeyBuffer).toString('hex')
            ),
            blockchain: Blockchain.ETHEREUM
        };
    }

    public getBalance(address: string): Promise<any> {
        throw new Error('Method not implemented.');
    }

    public sendTransaction(): Promise<any> {
        throw new Error('Method not implemented.');
    }

    public isValidAddress(address: string): boolean {
        if (address.length === 40) {
            return true;
        }
        return false;
    }
    public getFeeForAmount(amount: string): string {
        return '0.001';
    }
}
