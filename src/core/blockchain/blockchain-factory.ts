import { Blockchain } from './types';
import { GenericBlockchain } from './generic-blockchain';
import { Ethereum } from './ethereum';

export class BlockchainFactory {
    public static get(blockchain: Blockchain, networkId?: number): GenericBlockchain {
        switch (blockchain) {
            case Blockchain.ETHEREUM:
                return new Ethereum(networkId);
            default:
                throw new Error(`${this.constructor.name}: ${blockchain} implementation not found`);
        }
    }
}
