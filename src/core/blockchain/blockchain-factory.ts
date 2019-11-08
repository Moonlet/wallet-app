import { Blockchain, IBlockchain } from './types';
import { Zilliqa } from './zilliqa';
import { Ethereum } from './ethereum';

export const getBlockchain = (blockchain: Blockchain): IBlockchain => {
    switch (blockchain) {
        case Blockchain.ETHEREUM:
            return Ethereum;
        case Blockchain.ZILLIQA:
            return Zilliqa;
        default:
            throw new Error(`getBlockchain: ${blockchain} implementation not found`);
    }
};
