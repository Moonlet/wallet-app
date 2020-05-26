import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const DAI_MAINNET: ITokenConfigState = {
    name: 'Multi-collateral DAI',
    symbol: 'DAI',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png'
    },
    contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
