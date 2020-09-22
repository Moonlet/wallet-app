import { IWallet } from '../../types';
import { Blockchain, IBlockchainTransaction, DerivationType } from '../../../blockchain/types';
import { IAccountState } from '../../../../redux/wallets/state';
import { HWModel, HWConnection } from '../types';
import { AppFactory } from './apps-factory';
import { TransportFactory } from './transport-factory';
import { delay } from '../../../utils/time';
import { HDKeyFactory } from '../../hd-wallet/hd-key/hdkey-factory';
import { getBlockchain } from '../../../blockchain/blockchain-factory';
import { Mnemonic } from '../../hd-wallet/mnemonic';
import { captureException as SentryCaptureException } from '@sentry/react-native';

export class LedgerWallet implements IWallet {
    private deviceId: string;
    private deviceModel: HWModel;
    private connectionType: HWConnection;

    constructor(deviceModel: HWModel, connectionType: HWConnection, deviceId: string) {
        this.deviceId = deviceId;
        this.deviceModel = deviceModel;
        this.connectionType = connectionType;
    }

    public async isAppOpened(blockchain: Blockchain): Promise<boolean> {
        const transport = await this.getTransport();
        const app = await AppFactory.get(blockchain, transport);
        const info = await app.getInfo();

        if (info) return true;
        return false;
    }

    public onAppOpened(blockchain: Blockchain): Promise<void> {
        return new Promise(async resolve => {
            let opened = false;
            while (opened === false) {
                try {
                    const transport = await this.getTransport();
                    const app = await AppFactory.get(blockchain, transport);
                    const info = await app.getInfo();
                    if (info) {
                        opened = true;
                    }
                } catch {
                    // dont handle error - keep trying until user opens the app
                }
                await delay(1000);
            }
            resolve();
        });
    }

    public async getAccounts(
        blockchain: Blockchain,
        index: number,
        indexTo?: number
    ): Promise<IAccountState[]> {
        indexTo = indexTo || index;
        const accounts = [];

        try {
            await this.onAppOpened(blockchain);
            // each time an error generated the pair between app and device is lost and must be reinitiated
            const transport = await this.getTransport();
            const app = await AppFactory.get(blockchain, transport);
            const address = await app.getAddress(index, 0, undefined);

            const account: IAccountState = {
                index,
                selected: false,
                publicKey: address.publicKey,
                address: address.address,
                blockchain,
                tokens: null
            };
            accounts.push(account);
            return Promise.resolve(accounts);
        } catch (e) {
            Promise.reject('Communication error');
        }
    }

    public async sign(
        blockchain: Blockchain,
        accountIndex: number,
        tx: IBlockchainTransaction
    ): Promise<any> {
        try {
            await this.onAppOpened(blockchain);
            const transport = await this.getTransport();
            const app = await AppFactory.get(blockchain, transport);

            return Promise.resolve(app.signTransaction(accountIndex, 0, undefined, tx));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    public getTransport() {
        return TransportFactory.get(this.deviceModel, this.connectionType, this.deviceId);
    }

    public getPrivateKey(blockchain: Blockchain, accountIndex: number): string {
        return 'Method not implemented.';
    }

    public async getWalletCredentials(): Promise<{ publicKey: string; privateKey: string }> {
        try {
            const mnemonic = await Mnemonic.generate(12);

            const key = HDKeyFactory.get(DerivationType.HD_KEY, Buffer.from(mnemonic)).derive(
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
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }
}
