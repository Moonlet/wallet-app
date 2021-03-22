import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const ZLF_MAINNET: ITokenConfigState = {
    name: 'ZilFlip.com Shareholder Token',
    symbol: 'ZLF',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/zlf.png'
    },
    contractAddress: 'zil1r9dcsrya4ynuxnzaznu00e6hh3kpt7vhvzgva0',
    removable: true,
    defaultOrder: 999,
    decimals: 5,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
