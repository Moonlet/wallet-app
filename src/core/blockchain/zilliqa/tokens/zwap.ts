import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const ZWAP_MAINNET: ITokenConfigState = {
    name: 'Zilswap',
    symbol: 'ZWAP',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/zwap.png'
    },
    contractAddress: 'zil1p5suryq6q647usxczale29cu3336hhp376c627',
    removable: true,
    defaultOrder: 999,
    decimals: 12,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
