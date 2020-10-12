import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const UNI_MAINNET: ITokenConfigState = {
    name: 'Uniswap',
    symbol: 'UNI',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png'
    },
    contractAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
