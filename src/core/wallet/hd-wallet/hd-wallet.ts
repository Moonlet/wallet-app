import { IWallet } from '../types';
import HDKey from 'hdkey';
import { Mnemonic } from './mnemonic';
import { Blockchain, IBlockchainTransaction } from '../../blockchain/types';
import { getBlockchain } from '../../blockchain/blockchain-factory';
import { IAccountState } from '../../../redux/wallets/state';
import { readEncrypted } from '../../../core/secure/storage';

export class HDWallet implements IWallet {
    public static async loadFromStorage(walletId: string, pass: string): Promise<HDWallet> {
        const data = await readEncrypted(walletId, pass);
        return Promise.resolve(new HDWallet(data.toString()));
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
                `${this.constructor.name}.getAccounts(): indexTo value must be greated than index value.`
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
                return Promise.reject(`Blockchain implementation not found.`);
            } else {
                return Promise.reject('There was an error while generating the accounts.');
            }
        }
    }

    public getPrivateKey(blockchain: Blockchain, accountIndex: number): string {
        const blockchainInstance = getBlockchain(blockchain);
        const key = this.hdkey.derive(blockchainInstance.config.derivationPath);
        return key.derive(`m/${accountIndex}`).privateKey.toString('hex');
    }

    public async sign(
        blockchain: Blockchain,
        accountIndex: number,
        tx: IBlockchainTransaction
    ): Promise<any> {
        return getBlockchain(blockchain).transaction.sign(
            tx,
            this.getPrivateKey(blockchain, accountIndex)
        );
    }
}
