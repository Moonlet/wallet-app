import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const COMP_MAINNET: ITokenConfigState = {
    name: 'Compound',
    symbol: 'COMP',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png'
    },
    contractAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
