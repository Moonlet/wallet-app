import { BigNumber } from 'bignumber.js';
import { TokenType, IButtonCTA } from './token';
import { ChainIdType } from '.';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { IAffiliateBannerType } from '../../../components/affiliate-banner/types';

export enum BlockchainNameService {
    ENS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    ZNS = 'zil1jcgu2wlx6xejqk9jw3aaankw6lsjzeunx2j0jz',
    CNS = '0x7ea9ee21077f84339eda9c80048ec6db678642b1'
}

export type INameService = {
    tld: string | RegExp;
    service: BlockchainNameService;
    record?: string[];
};

export enum DerivationType {
    HD_KEY = 'HD_KEY',
    HD_KEY_ED25519 = 'HD_KEY_ED25519'
}

export interface IBlockchainConfig {
    derivationPath: string;
    derivationType: DerivationType;
    coin: string;
    defaultUnit: string;
    iconComponent: React.ComponentType<any>;
    droppedTxBlocksThreshold: number;
    autoAddedTokensSymbols: {
        [chainId: string]: {
            [symbol: string]: ITokenConfigState;
        };
    };
    tokens: {
        [symbol: string]: ITokenConfigState;
    };
    feeOptions: {
        gasPriceToken: string;
        defaults: {
            gasPrice: BigNumber;
            gasLimit: {
                [tokenType: string]: BigNumber;
            };
            gasPricePresets?: {
                cheap?: BigNumber;
                standard?: BigNumber;
                fast?: BigNumber;
                fastest?: BigNumber;
                low?: BigNumber;
                average?: BigNumber;
            };
        };
        ui: {
            availableTokenTypes: TokenType[];
            feeComponent: 'FeeTotal' | 'FeePresets';
            feeComponentAdvanced?: 'GasFeeAdvanced';
            gasPriceUnit: string;
            defaultPreset?: 'cheap' | 'standard' | 'fast' | 'fastest' | 'low' | 'average';
        };
    };
    ui: {
        validator?: {
            totalLabel: string;
            amountCardLabel: string;
            maximumNumberOfValidators?: number;
        };
        token?: {
            labels: {
                tabAccount?: string;
                tabDelegations?: string;
                tabValidators?: string;
                tabTransactions?: string;
            };
            sendStepLabels: string[];
            actionScreenLabels: {};
            accountCTA: {
                mainCta: IButtonCTA;
                mainCtaSmartScreen?: IButtonCTA;
            };
            delegationCTA: {
                mainCta: IButtonCTA;
                mainCtaSmartScreen?: IButtonCTA;
            };
            validatorCTA: {
                mainCta: IButtonCTA;
                otherCtas: IButtonCTA[];
            };
        };
        addressDisplay?: 'stripped';
        enableTokenManagement: boolean;
        enableAccountCreation: boolean;
        maxAccountsNumber: number;
        extraFields?: string[];
        displayName: string;
        affiliateBanners: {
            account: IAffiliateBannerType;
        };
        fetchAccountStatsSec: number;
    };
    networks: {
        testNet: ChainIdType;
        mainNet?: ChainIdType;
    };
    defaultOrder: number;
    nameServices?: INameService[];
    amountToKeepInAccount: {
        [accountType: string]: BigNumber;
    };
}
