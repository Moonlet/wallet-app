import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const ZETH_MAINNET: ITokenConfigState = {
    name: 'Zilliqa-bridged ETH',
    symbol: 'ZETH',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/zeth.png'
    },
    contractAddress: 'zil19j33tapjje2xzng7svslnsjjjgge930jx0w09v',
    removable: true,
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
