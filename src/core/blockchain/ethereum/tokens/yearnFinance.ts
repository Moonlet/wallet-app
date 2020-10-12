import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const YFI_MAINNET: ITokenConfigState = {
    name: 'Yearn Finance',
    symbol: 'YFI',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5864.png'
    },
    contractAddress: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
