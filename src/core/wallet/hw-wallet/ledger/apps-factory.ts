import { Blockchain } from '../../../blockchain/types';
import { Eth } from './apps/eth';
import { Zil } from './apps/zil';
import { IHardwareWalletApp } from './types';

export class AppFactory {
    public static async get(
        blockchain: Blockchain,
        transport: Transport
    ): Promise<IHardwareWalletApp> {
        switch (blockchain) {
            case Blockchain.ETHEREUM:
                return new Eth(transport);
            case Blockchain.ZILLIQA:
                return new Zil(transport);
            default:
                return Promise.reject();
        }
    }
}
