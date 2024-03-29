import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const GZIL_MAINNET: ITokenConfigState = {
    name: 'gZIL Governance Token',
    symbol: 'gZIL',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/gzil.png'
    },
    contractAddress: 'zil14pzuzq6v6pmmmrfjhczywguu0e97djepxt8g3e',
    removable: true,
    defaultOrder: 900, // 2nd position
    decimals: 15,
    ui: {
        decimals: 8,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};

export const GZIL_TESTNET: ITokenConfigState = {
    ...GZIL_MAINNET,
    contractAddress: 'zil10w2fwf5kdwqvjd2zyv6nr7da2d2z63g5dvtvsy'
};
