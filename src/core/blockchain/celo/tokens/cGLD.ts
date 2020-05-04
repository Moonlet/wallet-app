import { ITokenConfigState } from '../../../../redux/tokens/state';
import { TokenScreenComponentType, TokenType } from '../../types/token';
import BigNumber from 'bignumber.js';
import klona from 'klona';

export const CELO_GOLD_NATIVE: ITokenConfigState = {
    name: 'Celo Gold',
    symbol: 'cGLD',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/celo/cgld.png'
    },
    contractAddress: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    defaultOrder: 0,
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

export const CELO_GOLD_TESTNET_ALFAJORES: ITokenConfigState = {
    name: 'Celo Gold',
    symbol: 'cGLD',
    icon: {
        uri: 'https://fire.moonlet.io/static/tokens/icons/celo/cgld.png'
    },
    contractAddress: '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9',
    defaultOrder: 0,
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

export const CELO_GOLD_CONTRACT_ADDRESS = (contractAddress: string): ITokenConfigState => {
    const coin = klona(CELO_GOLD_TESTNET_ALFAJORES);
    coin.contractAddress = contractAddress;

    return coin;
};

export const CELO_GOLD_TESTNET_BAKLAVA = CELO_GOLD_CONTRACT_ADDRESS(
    '0x44f434E83A3179FCede28941b3a81953fb575217'
);

export const CELO_GOLD_MAINNET = CELO_GOLD_CONTRACT_ADDRESS(
    '0x471EcE3750Da237f93B8E339c536989b8978a438'
);
