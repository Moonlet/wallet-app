import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const SNX_MAINNET: ITokenConfigState = {
    name: 'Synthetix Network',
    symbol: 'SNX',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2586.png'
    },
    contractAddress: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
