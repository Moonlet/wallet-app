import { Blockchain } from '../blockchain/types';
import { ethNameResolver } from './ethNameResolver';
import { zilNameResolver } from './zilNameResolver';
import { cryptoNameResolver } from './cryptoNameResolver';
import { getBlockchain } from '../blockchain/blockchain-factory';

enum Endings {
    ZIL = 'zil',
    ETH = 'eth',
    CRYPTO = 'crypto'
}

export const resolveNameForBlockchain = async (
    blockchain: Blockchain,
    name: string
): Promise<{ address: string }> => {
    const ending = name.split('.').pop();
    const { tld, service, record } = getBlockchain(blockchain).config.nameServices.find(
        item => item.tld === ending
    );
    switch (blockchain) {
        case Blockchain.ETHEREUM: {
            switch (tld) {
                case Endings.ETH: {
                    return ethNameResolver(name, service);
                }
                case Endings.ZIL: {
                    return zilNameResolver(name, service, record);
                }
                case Endings.CRYPTO: {
                    return cryptoNameResolver(name, service, record);
                }
            }
        }
        case Blockchain.ZILLIQA: {
            switch (ending) {
                case Endings.ZIL: {
                    return zilNameResolver(name, service, record);
                }
                case Endings.CRYPTO: {
                    return cryptoNameResolver(name, service, record);
                }
            }
        }
    }
};
