import { Blockchain, IBlockchain } from './types';
import { Zilliqa } from './zilliqa';
import { Ethereum } from './ethereum';
import { Near } from './near';

export const getBlockchain = (blockchain: Blockchain): IBlockchain => {
    switch (blockchain) {
        case Blockchain.ETHEREUM:
            return Ethereum;
        case Blockchain.ZILLIQA:
            return Zilliqa;
        case Blockchain.NEAR:
            return Near;
        default:
            throw new Error(`getBlockchain: ${blockchain} implementation not found`);
    }
};

/**
 *
 */
export const BLOCKCHAIN_LIST = [Blockchain.ZILLIQA, Blockchain.ETHEREUM, Blockchain.NEAR];
