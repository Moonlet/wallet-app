import { IWallet } from '../types';
import { Mnemonic } from './mnemonic';
import { Blockchain, IBlockchainTransaction, DerivationType } from '../../blockchain/types';
import { getBlockchain } from '../../blockchain/blockchain-factory';
import { IAccountState } from '../../../redux/wallets/state';
import { HDKeyFactory } from './hd-key/hdkey-factory';
import { readEncrypted } from '../../secure/storage/storage';
import { getEncryptionKey } from '../../secure/keychain/keychain';

export class HDWallet implements IWallet {
    public static async loadFromStorage(walletId: string, pass: string): Promise<HDWallet> {
        const encryptionKey = await getEncryptionKey(pass);
        const data = await readEncrypted(walletId, encryptionKey);
        return Promise.resolve(new HDWallet(data.toString()));
    }
    private mnemonic: string;
    private seedCache: Buffer;

    constructor(mnemonic: string) {
        if (Mnemonic.verify(mnemonic)) {
            this.mnemonic = mnemonic;
        } else {
            throw new Error('Invalid mnemonic.');
        }
    }

    get seed() {
        if (!this.seedCache) {
            this.seedCache = Mnemonic.toSeed(this.mnemonic);
        }

        return this.seedCache;
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
            const key = HDKeyFactory.get(
                blockchainInstance.config.derivationType,
                this.seed
            ).derive(blockchainInstance.config.derivationPath);
            for (let i = index; i <= indexTo; i++) {
                const accountDerivationPath = blockchainInstance.account.getAccountDerivationPath(
                    i
                );
                const derivation = key.derive(`m/${accountDerivationPath}`);
                const privateKey = blockchainInstance.account.getPrivateKeyFromDerived(derivation);
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
        const key = HDKeyFactory.get(blockchainInstance.config.derivationType, this.seed).derive(
            blockchainInstance.config.derivationPath
        );
        const derivation = key.derive(
            `m/${blockchainInstance.account.getAccountDerivationPath(accountIndex)}`
        );
        return blockchainInstance.account.getPrivateKeyFromDerived(derivation);
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

    public getMnemonic() {
        return this.mnemonic;
    }

    public getWalletCredentials(): { publicKey: string; privateKey: string } {
        const key = HDKeyFactory.get(DerivationType.HD_KEY, this.seed).derive(
            `m/${'moonlet'
                .split('')
                .map(l => l.charCodeAt(0))
                .join('/')}`
        );

        const blockchainInstance = getBlockchain(Blockchain.ZILLIQA);
        const privateKey = blockchainInstance.account.getPrivateKeyFromDerived(key);
        const publicKey = blockchainInstance.account.privateToPublic(privateKey);

        return {
            publicKey,
            privateKey
        };
    }
}
