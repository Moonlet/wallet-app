import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const REDC_MAINNET: ITokenConfigState = {
    name: 'RedChillies',
    symbol: 'REDC',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/redc.png'
    },
    contractAddress: 'zil14jmjrkvfcz2uvj3y69kl6gas34ecuf2j5ggmye',
    removable: true,
    defaultOrder: 999,
    decimals: 9,
    ui: {
        decimals: 4,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
