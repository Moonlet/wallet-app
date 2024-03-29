import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';
import BigNumber from 'bignumber.js';
import { klona } from 'klona';
import { Platform } from 'react-native';

export const CELO_GOLD_NATIVE: ITokenConfigState = {
    name: 'Celo Gold',
    symbol: 'CELO',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/celo/celo.png'
    },
    removable: false,
    defaultOrder: 0,
    decimals: 18,
    ui: {
        decimals: 4,
        tokenScreenComponent: Platform.select({
            default: TokenScreenComponentType.DELEGATE,
            web: TokenScreenComponentType.DEFAULT
        })
    },
    type: TokenType.NATIVE,
    units: {
        WEI: new BigNumber(1),
        GWEI: new BigNumber(Math.pow(10, 9)),
        CELO: new BigNumber(Math.pow(10, 18))
    }
};

export const CELO_GOLD_TESTNET_ALFAJORES: ITokenConfigState = {
    name: 'Celo Gold',
    symbol: 'CELO',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/celo/celo.png'
    },
    removable: false,
    contractAddress: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    defaultOrder: 0,
    decimals: 18,
    ui: {
        decimals: 4,
        tokenScreenComponent: Platform.select({
            default: TokenScreenComponentType.DELEGATE,
            web: TokenScreenComponentType.DEFAULT
        })
    },
    type: TokenType.ERC20,
    units: {
        WEI: new BigNumber(1),
        GWEI: new BigNumber(Math.pow(10, 9)),
        CELO: new BigNumber(Math.pow(10, 18))
    }
};

export const CELO_GOLD_CONTRACT_ADDRESS = (contractAddress: string): ITokenConfigState => {
    const coin = klona(CELO_GOLD_TESTNET_ALFAJORES);
    coin.contractAddress = contractAddress;

    return coin;
};

export const CELO_GOLD_TESTNET_BAKLAVA = CELO_GOLD_CONTRACT_ADDRESS(
    '0xdDc9bE57f553fe75752D61606B94CBD7e0264eF8'
);

export const CELO_GOLD_MAINNET = CELO_GOLD_CONTRACT_ADDRESS(
    '0x471EcE3750Da237f93B8E339c536989b8978a438'
);
