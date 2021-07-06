import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const USDT_MAINNET: ITokenConfigState = {
    name: 'USDT',
    symbol: 'USDT',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/solana/usdt.png'
    },
    contractAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.SPL
};
