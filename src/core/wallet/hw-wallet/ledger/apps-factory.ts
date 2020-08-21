import { Blockchain } from '../../../blockchain/types';
import { Eth } from './apps/eth';
import { Zil } from './apps/zil';
import { Cosmos } from './apps/cosmos';
import { IHardwareWalletApp } from './types';
import { Celo } from './apps/celo';

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
            case Blockchain.COSMOS:
                return new Cosmos(transport);
            case Blockchain.CELO:
                return new Celo(transport);
            default:
                return Promise.reject();
        }
    }
}
