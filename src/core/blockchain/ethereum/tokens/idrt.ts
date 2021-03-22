import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const IDRT_MAINNET: ITokenConfigState = {
    name: 'Rupiah Token',
    symbol: 'IDRT',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/ethereum/idrt.png'
    },
    contractAddress: '0x998ffe1e43facffb941dc337dd0468d52ba5b48a',
    removable: true,
    defaultOrder: 999,
    decimals: 2,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};
