import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';
import XsgdIcon from '../../../../assets/icons/blockchains/XSGD.svg';
import BigNumber from 'bignumber.js';

export const XSGD_MAINNET: ITokenConfigState = {
    name: 'Xsgd',
    symbol: 'XSGD',
    icon: {
        iconComponent: XsgdIcon
    },
    contractAddress: 'zil1n0006zrsdtl0zj5mwac2rkaa442f4d37hntkv7',
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
