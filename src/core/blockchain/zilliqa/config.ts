import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType } from '../types/token';
import ZilIcon from '../../../assets/icons/blockchains/zil.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';

export const ZIL_NATIVE: ITokenConfigState = {
    name: 'Zilliqa',
    symbol: 'ZIL',
    icon: {
        iconComponent: ZilIcon
    },
    defaultOrder: 0,
    decimals: 12,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.NATIVE,
    units: {
        QA: new BigNumber(1),
        LI: new BigNumber(Math.pow(10, 6)),
        ZIL: new BigNumber(Math.pow(10, 12))
    }
};

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/313'/0'/0`,
    derivationType: DerivationType.HD_KEY,
    coin: 'ZIL',
    defaultUnit: 'QA',
    droppedTxBlocksThreshold: 10,
    iconComponent: ZilIcon,
    tokens: {
        ZIL: ZIL_NATIVE
    },
    feeOptions: {
        gasPriceToken: 'ZIL',
        defaults: {
            gasPrice: new BigNumber(1000000000),
            gasLimit: {
                [TokenType.NATIVE]: new BigNumber(1),
                [TokenType.ZRC2]: new BigNumber(10000)
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
        maxAccountsNumber: 5
    },
    networks: {
        testNet: 333,
        mainNet: 1
    },
    defaultOrder: 0
};
