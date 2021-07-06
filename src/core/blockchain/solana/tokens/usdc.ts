import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const USDC_MAINNET: ITokenConfigState = {
    name: 'USDC',
    symbol: 'USDC',
    icon: {
        uri:
            'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
    },
    contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.SPL
};

export const USDC_TESTNET: ITokenConfigState = {
    name: 'USDC',
    symbol: 'USDC',
    icon: {
        uri:
            'https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
    },
    contractAddress: 'CpMah17kQEL2wqyMKt3mZBdTnZbkbfx4nqmQMFDP5vwp',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.SPL
};
