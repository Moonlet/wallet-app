import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const ZCH_MAINNET: ITokenConfigState = {
    name: 'ZILCHESS',
    symbol: 'ZCH',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/zch.png'
    },
    contractAddress: 'zil1s8xzysqcxva2x6aducncv9um3zxr36way3fx9g',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
