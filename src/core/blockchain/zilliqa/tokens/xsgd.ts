import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';
import BigNumber from 'bignumber.js';

export const XSGD_MAINNET: ITokenConfigState = {
    name: 'Xsgd',
    symbol: 'XSGD',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/xsgd.png'
    },
    contractAddress: 'zil1n0006zrsdtl0zj5mwac2rkaa442f4d37hntkv7',
    removable: true,
    defaultOrder: 999,
    decimals: 12,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2,
    units: {
        QA: new BigNumber(1),
        LI: new BigNumber(Math.pow(10, 6)),
        ZIL: new BigNumber(Math.pow(10, 12))
    }
};
