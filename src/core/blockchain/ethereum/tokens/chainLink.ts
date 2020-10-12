import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const LINK_MAINNET: ITokenConfigState = {
    name: 'ChainLink Token',
    symbol: 'LINK',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png'
    },
    contractAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
