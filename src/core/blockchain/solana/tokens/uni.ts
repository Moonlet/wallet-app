import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const UNI_MAINNET: ITokenConfigState = {
    name: 'Wrapped UNI (Sollet)',
    symbol: 'UNI',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png'
    },
    contractAddress: 'DEhAasscXF4kEGxFgJ3bq4PpVGp5wyUxMRvn6TzGVHaw',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.SPL
};
