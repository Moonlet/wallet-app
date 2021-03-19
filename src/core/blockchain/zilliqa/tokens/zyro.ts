import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const ZYRO_MAINNET: ITokenConfigState = {
    name: 'zyro',
    symbol: 'ZYRO',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/zyro.png'
    },
    contractAddress: 'zil1ucvrn22x8366vzpw5t7su6eyml2auczu6wnqqg',
    removable: true,
    defaultOrder: 999,
    decimals: 8,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
