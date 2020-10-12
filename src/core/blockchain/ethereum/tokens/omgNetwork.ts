import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const OMG_MAINNET: ITokenConfigState = {
    name: 'OMG Network',
    symbol: 'OMG',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1808.png'
    },
    contractAddress: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
