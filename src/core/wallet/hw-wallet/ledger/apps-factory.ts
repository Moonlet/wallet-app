import { Blockchain } from '../../../blockchain/types';
import { Eth } from './apps/eth';
import { IHardwareWalletApp } from './types';

export class AppFactory {
    public static async get(
        blockchain: Blockchain,
        transport: Transport
    ): Promise<IHardwareWalletApp> {
        switch (blockchain) {
            case Blockchain.ETHEREUM:
                return new Eth(transport);

            default:
                return Promise.reject();
        }
    }
}
