import { IWallet } from '../types';
import HDKey from 'hdkey';
import { Mnemonic } from './mnemonic';
import { Blockchain } from '../../blockchain/types';
import { BlockchainFactory } from '../../blockchain/blockchain-factory';
import { IAccountState } from '../../../redux/wallets/state';

export class HDWallet implements IWallet {
    public static async loadFromStorage(walletId: string): Promise<HDWallet> {
        return Promise.resolve(new HDWallet(''));
    }
    private mnemonic: string;
    private hdkey: HDKey;

    constructor(mnemonic: string) {
        this.mnemonic = mnemonic;
        this.hdkey = HDKey.fromMasterSeed(Mnemonic.toSeed(this.mnemonic));
    }

    public getAccounts(
        blockchain: Blockchain,
        index: number,
        indexTo?: number
    ): Promise<IAccountState[]> {
        indexTo = indexTo || index;

        if (isNaN(Number(index))) {
            return Promise.reject(
                `${this.constructor.name}.getAccounts(): index must be a positive number.`
            );
        } else if (index < 0) {
            return Promise.reject(
                `${this.constructor.name}.getAccounts(): index must be a positive number.`
            );
        }

        if (isNaN(Number(indexTo))) {
            return Promise.reject(
                `${this.constructor.name}.getAccounts(): indexTo must be a positive number.`
            );
        } else if (indexTo < index) {
            return Promise.reject(
                `${
                    this.constructor.name
                }.getAccounts(): indexTo value must be greated than index value.`
            );
        }

        const accounts = [];
        const blockchainInstance = BlockchainFactory.get(blockchain);
        const key = this.hdkey.derive(blockchainInstance.DERIVATION_PATH);
        for (let i = index; i <= indexTo; i++) {
            const privateKey = key.derive(`m/${i}`).privateKey.toString('hex');
            accounts.push(blockchainInstance.getAccountFromPrivateKey(privateKey, i));
        }
        return Promise.resolve(accounts);
    }

    public sign(blockchain: Blockchain, accountIndex: number, tx: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
}
