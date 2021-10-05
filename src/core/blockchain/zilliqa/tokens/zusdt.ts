import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const ZUSDT_MAINNET: ITokenConfigState = {
    name: 'Zilliqa-bridged USDT',
    symbol: 'ZUSDT',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/zusdt.png'
    },
    contractAddress: 'zil1sxx29cshups269ahh5qjffyr58mxjv9ft78jqy',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
