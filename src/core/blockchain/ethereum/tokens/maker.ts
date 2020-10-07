import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const MKR_MAINNET: ITokenConfigState = {
    name: 'Maker',
    symbol: 'MKR',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png'
    },
    contractAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
