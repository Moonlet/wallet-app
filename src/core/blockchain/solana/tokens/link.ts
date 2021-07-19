import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const LINK_MAINNET: ITokenConfigState = {
    name: 'Wrapped Chainlink (Sollet)',
    symbol: 'LINK',
    icon: {
        uri:
            'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/CWE8jPTUYhdCTZYWPTe1o5DFqfdjzWKc9WKz6rSjQUdG/logo.png'
    },
    contractAddress: 'CWE8jPTUYhdCTZYWPTe1o5DFqfdjzWKc9WKz6rSjQUdG',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.SPL
};
