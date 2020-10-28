import { Blockchain } from '../../core/blockchain/types';
import { AccountType } from '../../redux/wallets/state';
import { IconValues } from '../icon/values';

export interface IScreenRequest {
    context: IScreenContext;
    user: IScreenUser;
}

export interface IScreenContext {
    screen: 'dashboard' | 'token';
    tab?: 'account';
}

export interface IScreenUser {
    os: 'android' | 'ios';
    deviceId: string;
    theme: 'dark' | 'light';
    country: string;
    lang: 'en';

    wallet: {
        pubKey: string;
        type: 'HD' | 'HW';
        hwOptions?: {
            vendor?: string;
            model?: string;
            connectionType?: string;
        };
    };

    blockchain: Blockchain;
    chainId: string;
    address: string;
    accountType: AccountType;
}

export interface IScreenResponse {
    widgets: IScreenWidget[];
}

export interface ICta {
    type: 'callAction' | 'openUrl' | 'navigateTo';
    params: {
        action?: string;
        url?: string;
        screen?: string;
        params?: any;
    };
    label?: string;
    buttonProps?: {
        primary?: boolean;
        secondary?: boolean;
        disabled?: boolean;
        colors?: {
            label: string;
            bg: string;
        };
    };
}

export interface IScreenWidget {
    title?: string;
    expandable?: boolean;
    initialState?: 'collapsed' | 'expanded';
    modules: IScreenModule[];
}

export interface IScreenModule {
    displayWhen?: 'collapsed' | 'expanded'; // if undefined, it will be displayed always
    type:
        | ModuleTypes.THREE_LINES_CTA
        | ModuleTypes.STATIC_TEXT_COLUMNS_TOP_HEADER
        | ModuleTypes.STATIC_TEXT_COLUMNS_BOTTOM_HEADER
        | ModuleTypes.BALANCES_GRID_ICONS
        | ModuleTypes.SINGLE_BALANCE_ICON
        | ModuleTypes.IMAGE_BANNER
        | ModuleTypes.TWO_LINES_TEXT_BANNER
        | ModuleTypes.SEPARATOR;
    cta?: ICta;
    data: (
        | I3LinesCtaData
        | IStaticTextColumnData
        | IBalanceGridData
        | IImageBannerData
        | I2LinesTextBannerData
        | ISeparatorData
    )[];
}

export enum ModuleTypes {
    STATIC_TEXT_COLUMNS_TOP_HEADER = 'static-text-columns-top-header',
    STATIC_TEXT_COLUMNS_BOTTOM_HEADER = 'static-text-columns-bottom-header',
    THREE_LINES_CTA = '3-lines-cta',
    BALANCES_GRID_ICONS = 'balances-grid-icons',
    SINGLE_BALANCE_ICON = 'single-balance-icon',
    SEPARATOR = 'separator',
    IMAGE_BANNER = 'image-banner',
    TWO_LINES_TEXT_BANNER = '2-lines-text-banner'
}

/// IModulesData \\\

// Used for `3-lines-cta`
export interface I3LinesCtaData {
    firstLine: string;
    secondLine: string;
    thirdLine: string;
}

// Used for `static-text-columns-top-header` and `static-text-columns-bottom-header`
export interface IStaticTextColumnData {
    headerValue: string;
    headerColor?: string;
    secondaryValue: string;
    secondaryColor?: string;
}

// Used for`balances-grid-icons` and `single-balance-icon`
export interface IBalanceGridData {
    label?: string;
    balance: {
        value: string; // BigNumber.toFixed()
        tokenSymbol: string;
        blockchain: Blockchain;
    };
    icon: {
        value: IconValues | string;
        color: string;
    };
}

// Used for `image-banner`
export interface IImageBannerData {
    imageUrl: string;
}

// Used for `2-lines-text-banner`
export interface I2LinesTextBannerData {
    firstLine: string;
    secondLine: string;
    icon?: {
        value: IconValues;
        color?: string;
    };
    backgroundColor?: string;
}

// Used for `separator`
export interface ISeparatorData {
    color?: string;
}
