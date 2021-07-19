import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const JPYC_MAINNET: ITokenConfigState = {
    name: 'JPYC',
    symbol: 'JPYC',
    icon: {
        uri:
            'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/5trVBqv1LvHxiSPMsHtEZuf8iN82wbpDcR5Zaw7sWC3s/logo.png'
    },
    contractAddress: '5trVBqv1LvHxiSPMsHtEZuf8iN82wbpDcR5Zaw7sWC3s',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.SPL
};
