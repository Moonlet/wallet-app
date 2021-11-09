import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const XCAD_MAINNET: ITokenConfigState = {
    name: 'XCAD Network',
    symbol: 'XCAD',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/xcad.png'
    },
    contractAddress: 'zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y',
    removable: true,
    defaultOrder: 910, // 3rd position
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
