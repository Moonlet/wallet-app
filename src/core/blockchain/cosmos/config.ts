import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType } from '../types/token';

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/118'/0'/0`,
    derivationType: DerivationType.HD_KEY,
    coin: 'ATOM',
    defaultUnit: 'UATOM',
    tokens: {
        ATOM: {
            name: 'Atom',
            symbol: 'ATOM',
            logo: {
                uri:
                    'https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/icon/atom.png'
            },
            order: 0,
            active: true,
            decimals: 6,
            ui: {
                decimals: 3,
                tokenScreenComponent: TokenScreenComponentType.DELEGATE
            },
            type: TokenType.NATIVE,
            units: {
                UATOM: new BigNumber(1),
                ATOM: new BigNumber(Math.pow(10, 6))
            },
            symbolMap: {
                'gaia-13007': 'umuon'
            }
        }
    },
    feeOptions: {
        gasPriceToken: 'UATOM',
        defaults: {
            gasPrice: new BigNumber(1),
            gasLimit: new BigNumber(100000),
            gasPricePresets: {
                low: new BigNumber(0.0025),
                average: new BigNumber(0.025)
            }
        },
        ui: {
            availableTokenTypes: [],
            feeComponent: 'FeePresets',
            gasPriceUnit: 'UATOM',
            defaultPreset: 'low'
        }
    },
    ui: {
        token: {
            labels: {
                tabAccount: 'App.labels.account',
                tabDelegations: 'App.labels.delegations',
                tabValidators: 'App.labels.validators',
                tabTransactions: 'App.labels.transactions'
            }
        },
        addressDisplay: 'stripped',
        enableTokenManagement: false,
        enableAccountCreation: false,
        maxAccountsNumber: 5,
        extraFields: ['Memo']
    },
    networks: {
        testNet: 'gaia-13007',
        mainNet: 'cosmoshub-3'
    },
    defaultOrder: 3
};
