import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const XSGD_MAINNET: ITokenConfigState = {
    name: 'Xsgd',
    symbol: 'XSGD',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/xsgd.png'
    },
    contractAddress: 'zil1zu72vac254htqpg3mtywdcfm84l3dfd9qzww8t',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
