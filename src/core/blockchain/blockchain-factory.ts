import { Blockchain, IBlockchain } from './types';
import { Zilliqa } from './zilliqa';
import { Ethereum } from './ethereum';
import { Near } from './near';
import { Cosmos } from './cosmos';
import { Celo } from './celo';
import { Solana } from './solana';

export const getBlockchain = (blockchain: Blockchain): IBlockchain => {
    switch (blockchain) {
        case Blockchain.ETHEREUM:
            return Ethereum;
        case Blockchain.ZILLIQA:
            return Zilliqa;
        case Blockchain.NEAR:
            return Near;
        case Blockchain.SOLANA:
            return Solana;
        case Blockchain.COSMOS:
            return Cosmos;
        case Blockchain.CELO:
            return Celo;
        default:
            throw new Error(`getBlockchain: ${blockchain} implementation not found`);
    }
};

export const BLOCKCHAIN_LIST = [
    Blockchain.ZILLIQA,
    Blockchain.ETHEREUM,
    Blockchain.SOLANA,
    Blockchain.CELO,
    Blockchain.NEAR,
    Blockchain.COSMOS
];
