import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const GZIL_TESTNET: ITokenConfigState = {
    name: 'gZil',
    symbol: 'gZIL',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/gzil.png'
    },
    contractAddress: 'zil10w2fwf5kdwqvjd2zyv6nr7da2d2z63g5dvtvsy',
    removable: true,
    defaultOrder: 999,
    decimals: 15,
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
    contractAddress: 'zil10w2fwf5kdwqvjd2zyv6nr7da2d2z63g5dvtvsy', // TODO Must be updated
    removable: true,
    defaultOrder: 999,
    decimals: 15,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
