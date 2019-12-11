import { IWallet } from '../../types';
import { Blockchain, IBlockchainTransaction } from '../../../blockchain/types';
import { IAccountState } from '../../../../redux/wallets/state';
import { HWModel, HWConnection } from '../types';
import { AppFactory } from './apps-factory';
import { TransportFactory } from './transport-factory';
import { delay } from '../../../utils/time';

export class LedgerWallet implements IWallet {
    private deviceId: string;
    private deviceModel: HWModel;
    private connectionType: HWConnection;

    constructor(deviceModel: HWModel, connectionType: HWConnection, deviceId: string) {
        this.deviceId = deviceId;
        this.deviceModel = deviceModel;
        this.connectionType = connectionType;
    }

    public onAppOpened(blockchain: Blockchain): Promise<void> {
        return new Promise(async resolve => {
            let opened = false;
            while (opened === false) {
                try {
                    const transport = await this.getTransport();
                    const app = await AppFactory.get(blockchain, transport);
                    if (await app.getInfo()) {
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
                publicKey: address.publicKey,
                address: address.address,
                blockchain
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
        return Promise.reject('NOT_IMPLEMENTED');
    }

    public getTransport() {
        return TransportFactory.get(this.deviceModel, this.connectionType, this.deviceId);
    }
}
