import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';
import BigNumber from 'bignumber.js';

export const CELO_USD_TESTNET_ALFAJORES: ITokenConfigState = {
    name: 'Celo USD',
    symbol: 'cUSD',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/celo/cusd.png'
    },
    contractAddress: '0xa561131a1C8aC25925FB848bCa45A74aF61e5A38',
    defaultOrder: 999,
    decimals: 18,
    ui: {
        decimals: 4,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.ERC20,
    units: {
        WEI: new BigNumber(1),
        GWEI: new BigNumber(Math.pow(10, 9)),
        cGLD: new BigNumber(Math.pow(10, 18))
    }
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
