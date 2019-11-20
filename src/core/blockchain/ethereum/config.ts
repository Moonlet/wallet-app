import { IBlockchainConfig } from '../types';
import { BigNumber } from 'bignumber.js';

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/60'/0'/0`,
    coin: 'ETH',
    defaultUnit: 'WEI',
    units: {
        WEI: new BigNumber(1),
        GWEI: new BigNumber(Math.pow(10, 9)),
        ETH: new BigNumber(Math.pow(10, 18))
    },
    decimals: 4
};
