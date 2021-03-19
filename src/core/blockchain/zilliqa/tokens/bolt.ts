import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const BOLT_MAINNET: ITokenConfigState = {
    name: 'Bolt Toke',
    symbol: 'BOLT',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/bolt.png'
    },
    contractAddress: 'zil1x6z064fkssmef222gkhz3u5fhx57kyssn7vlu0',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
