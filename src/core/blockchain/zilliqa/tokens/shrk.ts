import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const SHRK_MAINNET: ITokenConfigState = {
    name: 'SHARK',
    symbol: 'SHRK',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/shrk.png'
    },
    contractAddress: 'zil17tsmlqgnzlfxsq4evm6n26txm2xlp5hele0kew',
    removable: true,
    defaultOrder: 999,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
