import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const KKZ_MAINNET: ITokenConfigState = {
    name: 'KrazyKewlZil',
    symbol: 'KKZ',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/kkz.png'
    },
    contractAddress: 'zil1p2cp77kz06wlxeyha4psawencm5gx8ttcwsxdn',
    removable: true,
    defaultOrder: 999,
    decimals: 5,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
