import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const GRT_MAINNET: ITokenConfigState = {
    name: 'GRT Token',
    symbol: 'GRT',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png'
    },
    contractAddress: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
    removable: false,
    defaultOrder: 900,
    decimals: 18,
    ui: {
        decimals: 4,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};

export const GRT_TESTNET: ITokenConfigState = {
    name: 'GRT Token',
    symbol: 'GRT',
    icon: {
        uri: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png'
    },
    contractAddress: '0x54fe55d5d255b8460fb3bc52d5d676f9ae5697cd',
    removable: false,
    defaultOrder: 900,
    decimals: 18,
    ui: {
        decimals: 4,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
