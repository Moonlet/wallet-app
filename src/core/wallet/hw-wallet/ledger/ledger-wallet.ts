import { IWallet } from '../../types';
import { Blockchain, IBlockchainTransaction, DerivationType } from '../../../blockchain/types';
import { AccountType, IAccountState } from '../../../../redux/wallets/state';
import { HWModel, HWConnection } from '../types';
import { AppFactory } from './apps-factory';
import { TransportFactory } from './transport-factory';
import { delay } from '../../../utils/time';
import { HDKeyFactory } from '../../hd-wallet/hd-key/hdkey-factory';
import { getBlockchain } from '../../../blockchain/blockchain-factory';
import { Mnemonic } from '../../hd-wallet/mnemonic';
import { captureException as SentryCaptureException } from '@sentry/react-native';

export enum LedgerSignEvent {
    LOADING = 'LOADING',
    CONNECT_DEVICE = 'CONNECT_DEVICE',
    DEVICE_CONNECTED = 'DEVICE_CONNECTED',
    OPEN_APP = 'OPEN_APP',
    APP_OPENED = 'APP_OPENED',
    DONE = 'DONE',
    ERROR = 'ERROR',
    TERMINATED = 'TERMINATED',

    // TX
    SIGN_TX = 'SIGN_TX',
    TX_SIGNED = 'TX_SIGNED',
    TX_SIGN_DECLINED = 'TX_SIGN_DECLINED',

    // MSG
    SIGN_MSG = 'SIGN_MSG',
    MSG_SIGNED = 'MSG_SIGNED',
    MSG_SIGN_DECLINED = 'MSG_SIGN_DECLINED'
}

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
        try {
            const transport = await this.getTransport();
            const app = await AppFactory.get(blockchain, transport);
            const info = await app.getInfo();

            if (info) return true;
            return false;
        } catch {
            return false;
        }
    }

    public onAppOpened(blockchain: Blockchain): Promise<void> {
        return new Promise(async resolve => {
            let opened = false;
            while (opened === false) {
                try {
                    opened = await this.isAppOpened(blockchain);
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
        accountType: AccountType,
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
                type: AccountType.DEFAULT,
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

    public async smartSign(
        blockchain: Blockchain,
        accountIndex: number,
        tx: IBlockchainTransaction,
        cb: (event: LedgerSignEvent) => any,
        setTerminate?: (terminate: () => any) => any
    ): Promise<any> {
        let shouldTerminate = false;
        const terminate = () => {
            shouldTerminate = true;
        };

        const terminateIfNeeded = () => {
            if (shouldTerminate) {
                throw new Error('TERMINATED');
            }
        };

        if (typeof setTerminate === 'function') {
            setTerminate(terminate);
        }

        try {
            terminateIfNeeded();
            // return loading
            cb(LedgerSignEvent.LOADING);

            // detect device, if device is not connected or not found within 300ms, trigger connect device event
            // const connectTimeout = setTimeout(() => cb(LedgerSignEvent.CONNECT_DEVICE), 1000);
            cb(LedgerSignEvent.CONNECT_DEVICE);
            let transport;
            try {
                transport = await this.getTransport();
            } catch (e) {
                // add some delay for the cases of instant fails, CONNECT_DEVICE and ERROR events are too quick triggerd
                await delay(2000);
                throw e;
            }
            terminateIfNeeded();
            cb(LedgerSignEvent.DEVICE_CONNECTED);

            // detect if app is opened
            const appOpenedTimeout = setTimeout(() => cb(LedgerSignEvent.OPEN_APP), 2000);
            await this.onAppOpened(blockchain);
            terminateIfNeeded();
            clearTimeout(appOpenedTimeout);
            cb(LedgerSignEvent.APP_OPENED);

            // review tx
            cb(LedgerSignEvent.SIGN_TX);
            if (this.connectionType === HWConnection.USB) {
                transport = await this.getTransport();
            }
            const app = await AppFactory.get(blockchain, transport);
            terminateIfNeeded();
            const signature = await app.signTransaction(accountIndex, 0, undefined, tx);
            terminateIfNeeded();
            cb(LedgerSignEvent.TX_SIGNED);

            cb(LedgerSignEvent.DONE);
            return signature;
        } catch (e) {
            if (e !== 'TERMINATED') {
                const message = e?.message || '';
                if (message?.indexOf('denied by the user') >= 0) {
                    cb(LedgerSignEvent.TX_SIGN_DECLINED);
                } else {
                    cb(LedgerSignEvent.ERROR);
                }
            } else {
                cb(LedgerSignEvent.TERMINATED);
            }
            return Promise.reject(e);
        }
    }

    signMessage(
        blockchain: Blockchain,
        accountIndex: number,
        accountType: AccountType,
        message: string
    ): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public async smartSignMessage(
        blockchain: Blockchain,
        accountIndex: number,
        msg: string,
        cb: (event: LedgerSignEvent) => any,
        setTerminate?: (terminate: () => any) => any
    ): Promise<any> {
        let shouldTerminate = false;
        const terminate = () => {
            shouldTerminate = true;
        };

        const terminateIfNeeded = () => {
            if (shouldTerminate) {
                throw new Error('TERMINATED');
            }
        };

        if (typeof setTerminate === 'function') {
            setTerminate(terminate);
        }

        try {
            terminateIfNeeded();
            // return loading
            cb(LedgerSignEvent.LOADING);

            // detect device, if device is not connected or not found within 300ms, trigger connect device event
            // const connectTimeout = setTimeout(() => cb(LedgerSignEvent.CONNECT_DEVICE), 1000);
            cb(LedgerSignEvent.CONNECT_DEVICE);
            let transport;
            try {
                transport = await this.getTransport();
            } catch (e) {
                // add some delay for the cases of instant fails, CONNECT_DEVICE and ERROR events are too quick triggerd
                await delay(2000);
                throw e;
            }
            terminateIfNeeded();
            cb(LedgerSignEvent.DEVICE_CONNECTED);

            // detect if app is opened
            const appOpenedTimeout = setTimeout(() => cb(LedgerSignEvent.OPEN_APP), 2000);
            await this.onAppOpened(blockchain);
            terminateIfNeeded();
            clearTimeout(appOpenedTimeout);
            cb(LedgerSignEvent.APP_OPENED);

            // review message
            cb(LedgerSignEvent.SIGN_MSG);
            if (this.connectionType === HWConnection.USB) {
                transport = await this.getTransport();
            }
            const app = await AppFactory.get(blockchain, transport);
            terminateIfNeeded();
            const signature = await app.signMessage(accountIndex, 0, undefined, msg);
            terminateIfNeeded();
            cb(LedgerSignEvent.MSG_SIGNED);

            cb(LedgerSignEvent.DONE);
            return signature;
        } catch (e) {
            if (e !== 'TERMINATED') {
                const message = e?.message || '';
                if (message?.indexOf('denied by the user') >= 0) {
                    cb(LedgerSignEvent.MSG_SIGN_DECLINED);
                } else {
                    cb(LedgerSignEvent.ERROR);
                }
            } else {
                cb(LedgerSignEvent.TERMINATED);
            }
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
