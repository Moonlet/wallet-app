import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const PORT_MAINNET: ITokenConfigState = {
    name: 'Proof Of Receipt Token',
    symbol: 'PORT',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/port.png'
    },
    contractAddress: 'zil18f5rlhqz9vndw4w8p60d0n7vg3n9sqvta7n6t2',
    removable: true,
    defaultOrder: 999,
    decimals: 4,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
