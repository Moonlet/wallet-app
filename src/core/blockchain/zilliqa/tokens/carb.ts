import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const CARB_MAINNET: ITokenConfigState = {
    name: 'CARBON',
    symbol: 'CARB',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/carb.png'
    },
    contractAddress: 'zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk',
    removable: true,
    defaultOrder: 999,
    decimals: 8,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
