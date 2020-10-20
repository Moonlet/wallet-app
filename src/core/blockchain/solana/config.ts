import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType } from '../types/token';
import SolIcon from '../../../assets/icons/blockchains/sol.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { AffiliateBannerType } from '../../../components/affiliate-banner/types';
import { AccountType } from '../../../redux/wallets/state';

export const SOL_NATIVE: ITokenConfigState = {
    name: 'Solana',
    symbol: 'SOL',
    icon: {
        iconComponent: SolIcon
    },
    defaultOrder: 0,
    decimals: 9,
    removable: false,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.NATIVE,
    units: {
        QA: new BigNumber(1),
        LI: new BigNumber(Math.pow(10, 9)),
        SOL: new BigNumber(Math.pow(10, 9))
    }
};

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/501'`,
    derivationType: DerivationType.HD_KEY_ED25519,
    coin: 'SOL',
    defaultUnit: 'QA',
    droppedTxBlocksThreshold: 10,
    iconComponent: SolIcon,
    autoAddedTokensSymbols: {},
    tokens: {
        SOL: SOL_NATIVE
    },
    feeOptions: {
        gasPriceToken: 'SOL',
        defaults: {
            gasPrice: new BigNumber(1000000000),
            gasLimit: {
                [TokenType.NATIVE]: new BigNumber(1)
            }
        },
        ui: {
            availableTokenTypes: [],
            feeComponent: 'FeeTotal',
            feeComponentAdvanced: 'GasFeeAdvanced',
            gasPriceUnit: 'LI'
        }
    },
    ui: {
        addressDisplay: 'stripped',
        enableTokenManagement: true,
        enableAccountCreation: false,
        maxAccountsNumber: 5,
        displayName: 'SOL',
        affiliateBanners: {
            account: AffiliateBannerType.LEDGER_NANO_X
        },
        fetchAccountStatsSec: 1
    },
    networks: {
        testNet: '2',
        mainNet: '1'
    },
    defaultOrder: 0,
    amountToKeepInAccount: {
        [AccountType.DEFAULT]: new BigNumber(10).pow(12)
    }
};
