import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const ZLP_MAINNET: ITokenConfigState = {
    name: 'ZilPay wallet',
    symbol: 'ZLP',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/zlp.png'
    },
    contractAddress: 'zil1l0g8u6f9g0fsvjuu74ctyla2hltefrdyt7k5f4',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
