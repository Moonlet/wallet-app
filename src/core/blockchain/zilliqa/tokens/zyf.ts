import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const ZYF_MAINNET: ITokenConfigState = {
    name: 'Zil Yield Farming',
    symbol: 'ZYF',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/zyf.png'
    },
    contractAddress: 'zil1arrjugcg28rw8g9zxpa6qffc6wekpwk2alu7kj',
    removable: true,
    defaultOrder: 999,
    decimals: 3,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
