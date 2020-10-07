import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const LEND_MAINNET: ITokenConfigState = {
    name: 'Eth Lend',
    symbol: 'LEND',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/icons/ethereum/ethland.png'
    },
    contractAddress: '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
