import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';

export const CELO_USD_TESTNET_ALFAJORES: ITokenConfigState = {
    name: 'Celo USD',
    symbol: 'cUSD',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/celo/cusd.png'
    },
    removable: true,
    contractAddress: '0x874069fa1eb16d44d622f2e0ca25eea172369bc1',
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 4,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20
};

export const CELO_USD_CONTRACT_ADDRESS = (contractAddress: string): ITokenConfigState => {
    const coin = CELO_USD_TESTNET_ALFAJORES;
    coin.contractAddress = contractAddress;

    return coin;
};

export const CELO_USD_TESTNET_BAKLAVA = CELO_USD_CONTRACT_ADDRESS(
    '0x4b84c2EF94A274DbF83E2F1Ec1608456c9B62D96'
);

export const CELO_USD_MAINNET = CELO_USD_CONTRACT_ADDRESS(
    '0x765DE816845861e75A25fCA122bb6898B8B1282a'
);
