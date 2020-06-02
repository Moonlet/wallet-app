import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const XSGD_MAINNET: ITokenConfigState = {
    name: 'Xsgd',
    symbol: 'XSGD',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/xsgd.png'
    },
    contractAddress: 'zil1nhgpfnhjev6kthfnmzw64ladytcaptl6r7xcvn',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
