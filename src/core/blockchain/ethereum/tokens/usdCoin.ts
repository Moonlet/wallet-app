import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const USDC_MAINNET: ITokenConfigState = {
    name: 'USD Coin',
    symbol: 'USDC',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png'
    },
    contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
