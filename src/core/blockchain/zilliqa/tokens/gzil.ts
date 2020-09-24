import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const GZIL_TESTNET: ITokenConfigState = {
    name: 'gZil',
    symbol: 'gZIL',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/gzil.png'
    },
    contractAddress: 'zil16qufswtegzw23zu84cu6dxhvxy6hrs0xkc4ke6',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};

export const GZIL_MAINNET: ITokenConfigState = {
    name: 'gZil',
    symbol: 'gZIL',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/gzil.png'
    },
    contractAddress: 'zil16qufswtegzw23zu84cu6dxhvxy6hrs0xkc4ke6', // TODO Must be updated
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
