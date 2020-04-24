import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType } from '../types/token';
import CeloIcon from '../../../assets/icons/blockchains/celo.svg';
import EthIcon from '../../../assets/icons/blockchains/eth.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';

export const CELO_GOLD: ITokenConfigState = {
    name: 'Celo Gold',
    symbol: 'cGLD',
    icon: {
        iconComponent: EthIcon
    },
    defaultOrder: 0,
    decimals: 18,
    ui: {
        decimals: 4,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.NATIVE,
    units: {
        WEI: new BigNumber(1),
        GWEI: new BigNumber(Math.pow(10, 9)),
        cGLD: new BigNumber(Math.pow(10, 18))
    }
};

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/52752'/0'/0`,
    derivationType: DerivationType.HD_KEY,
    coin: 'cGLD',
    defaultUnit: 'WEI',
    iconComponent: CeloIcon,
    droppedTxBlocksThreshold: 50,
    autoAddedTokensSymbols: {},
    tokens: {
        cGLD: CELO_GOLD
    },
    feeOptions: {
        gasPriceToken: 'cGLD',
        defaults: {
            gasPrice: new BigNumber(20000000000),
            gasLimit: {
                [TokenType.NATIVE]: new BigNumber(21000),
                [TokenType.ERC20]: new BigNumber(100000)
            },
            gasPricePresets: {
                cheap: new BigNumber(2000000000),
                standard: new BigNumber(20000000000),
                fast: new BigNumber(40000000000),
                fastest: new BigNumber(120000000000)
            }
        },
        ui: {
            availableTokenTypes: [TokenType.ERC20],
            feeComponent: 'FeePresets',
            feeComponentAdvanced: 'GasFeeAdvanced',
            gasPriceUnit: 'GWEI',
            defaultPreset: 'standard'
        }
    },
    ui: {
        addressDisplay: 'stripped',
        enableTokenManagement: true,
        enableAccountCreation: false,
        maxAccountsNumber: 5,
        blockchainDisplay: 'CELO'
    },
    networks: {
        testNet: 40120,
        mainNet: 1
    },
    defaultOrder: 1
};
