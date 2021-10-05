import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const ZWBTC_MAINNET: ITokenConfigState = {
    name: 'Zilliqa-bridged WBTC',
    symbol: 'ZWBTC',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/zilliqa/zwbtc.png'
    },
    contractAddress: 'zil1wha8mzaxhm22dpm5cav2tepuldnr8kwkvmqtjq',
    removable: true,
    defaultOrder: 999,
    decimals: 8,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ZRC2
};
