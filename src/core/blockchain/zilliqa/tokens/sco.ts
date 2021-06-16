import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const SCO_MAINNET: ITokenConfigState = {
    name: 'Score',
    symbol: 'SCO',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/sco.png'
    },
    contractAddress: 'zil1kwfu3x9n6fsuxc4ynp72uk5rxge25enw7zsf9z',
    removable: true,
    defaultOrder: 999,
    decimals: 4,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
