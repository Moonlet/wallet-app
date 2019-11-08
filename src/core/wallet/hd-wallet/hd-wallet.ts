import { IWallet } from '../types';
import HDKey from 'hdkey';
import { Mnemonic } from './mnemonic';
import { Blockchain } from '../../blockchain/types';
import { getBlockchain } from '../../blockchain/blockchain-factory';
import { IAccountState } from '../../../redux/wallets/state';

export class HDWallet implements IWallet {
    public static async loadFromStorage(walletId: string): Promise<HDWallet> {
        return Promise.resolve(new HDWallet(''));
    }
    private mnemonic: string;
    private hdkey: HDKey;

    constructor(mnemonic: string) {
        if (Mnemonic.verify(mnemonic)) {
            this.mnemonic = mnemonic;
        } else {
            throw new Error('Invalid mnemonic.');
        }

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
        }

        if (indexTo < index) {
            return Promise.reject(
                `${
                    this.constructor.name
                }.getAccounts(): indexTo value must be greated than index value.`
            );
        }

        try {
            const accounts = [];
            const blockchainInstance = getBlockchain(blockchain);
            const key = this.hdkey.derive(blockchainInstance.config.derivationPath);
            for (let i = index; i <= indexTo; i++) {
                const privateKey = key.derive(`m/${i}`).privateKey.toString('hex');
                accounts.push(blockchainInstance.account.getAccountFromPrivateKey(privateKey, i));
            }
            return Promise.resolve(accounts);
        } catch (e) {
            if (e.message.indexOf('implementation not found')) {
                return Promise.reject('Blockchain implementation not found.');
            } else {
                return Promise.reject('There was an error while generating the accounts.');
            }
        }
    }

    public sign(blockchain: Blockchain, accountIndex: number, tx: string): Promise<string> {
        throw new Error('Method not implemented.');
    }
}
