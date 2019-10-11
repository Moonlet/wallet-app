import { Blockchain } from './types';
import { GenericBlockchain } from './generic-blockchain';
import { Ethereum } from './ethereum';
import { Zilliqa } from './zilliqa';

export class BlockchainFactory {
    public static get(blockchain: Blockchain, networkId?: number): GenericBlockchain {
        switch (blockchain) {
            case Blockchain.ETHEREUM:
                return new Ethereum(networkId);
            case Blockchain.ZILLIQA:
                return new Zilliqa(networkId);
            default:
                throw new Error(`${this.constructor.name}: ${blockchain} implementation not found`);
        }
    }
}
