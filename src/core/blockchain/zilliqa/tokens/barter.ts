import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const BARTER_MAINNET: ITokenConfigState = {
    name: 'CryptoBarter.group',
    symbol: 'BARTER',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/barter.png'
    },
    contractAddress: 'zil17zvlqn2xamqpumlm2pgul9nezzd3ydmrufxnct',
    removable: true,
    defaultOrder: 999,
    decimals: 2,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
