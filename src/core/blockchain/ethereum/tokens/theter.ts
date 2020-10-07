import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const USDT_MAINNET: ITokenConfigState = {
    name: 'Tether USD',
    symbol: 'USDT',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/icons/ethereum/usdt.png'
    },
    contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
