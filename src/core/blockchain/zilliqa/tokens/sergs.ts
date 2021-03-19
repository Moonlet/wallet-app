import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const SERGS_MAINNET: ITokenConfigState = {
    name: 'Sergey Saved Link',
    symbol: 'SERGS',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/sergs.png'
    },
    contractAddress: 'zil1ztmv5jhfpnxu95ts9ylup7hj73n5ka744jm4ea',
    removable: true,
    defaultOrder: 999,
    decimals: 5,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
