import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType } from '../types/token';
import CeloIcon from '../../../assets/icons/blockchains/celo.svg';
import { CELO_GOLD_TESTNET_ALFAJORES } from './tokens/cGLD';
import { CELO_USD_MAINNET, CELO_USD_TESTNET_ALFAJORES } from './tokens/cUSD';

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/52752'/0'/0`,
    derivationType: DerivationType.HD_KEY,
    coin: 'cGLD',
    defaultUnit: 'WEI',
    iconComponent: CeloIcon,
    droppedTxBlocksThreshold: 50,
    autoAddedTokensSymbols: {
        42220: {
            cUSD: CELO_USD_MAINNET
        },
        44786: {
            cUSD: CELO_USD_TESTNET_ALFAJORES
        }
    },
    tokens: {
        cGLD: CELO_GOLD_TESTNET_ALFAJORES
    },
    feeOptions: {
        gasPriceToken: 'cGLD',
        defaults: {
            gasPrice: new BigNumber(20000000000),
            gasLimit: {
                [TokenType.ERC20]: new BigNumber(100000)
            }
        },
        ui: {
            availableTokenTypes: [TokenType.ERC20],
            feeComponent: 'FeeTotal',
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
        testNet: 44786,
        mainNet: 42220
    },
    defaultOrder: 1
};
