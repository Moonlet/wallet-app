import { Blockchain } from '../../core/blockchain/types';
import { AccountType } from '../../redux/wallets/state';
import { IconValues } from '../icon/values';

export interface IScreenRequest {
    context: IScreenContext;
    user: IScreenUser;
}

export interface IScreenContext {
    screen: ContextScreen;
    tab?: ContextTab;
}

export enum ContextScreen {
    DASHBOARD = 'dashboard',
    TOKEN = 'token',
    QUICK_STAKE_SELECT_VALIDATOR = 'quickStakeSelectValidator'
}

export enum ContextTab {
    ACCOUNT = 'account'
}

export interface IScreenUser {
    os: 'android' | 'ios' | 'web';
    deviceId: string;
    appVersion: string;
    theme: 'dark' | 'light';
    country?: string;
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
    style?: IDataStyle;
    modules: IScreenModule[];
}

export interface IScreenModule {
    displayWhen?: 'collapsed' | 'expanded'; // if undefined, it will be displayed always
    hidden?: boolean;
    style?: IDataStyle;
    type:
        | ModuleTypes.BALANCES_GRID_ICONS
        | ModuleTypes.ICON
        | ModuleTypes.ICON_TWO_LINES
        | ModuleTypes.IMAGE_BANNER
        | ModuleTypes.MODULE_COLUMNS_WRAPPER
        | ModuleTypes.MODULE_SELECTABLE_WRAPPER
        | ModuleTypes.MODULE_WRAPPER
        | ModuleTypes.ONE_LINE_TEXT_BANNER
        | ModuleTypes.SEPARATOR
        | ModuleTypes.SINGLE_BALANCE_ICON
        | ModuleTypes.STATIC_TEXT_COLUMNS_BOTTOM_HEADER
        | ModuleTypes.STATIC_TEXT_COLUMNS_TOP_HEADER
        | ModuleTypes.THREE_LINES_CTA
        | ModuleTypes.THREE_LINES_ICON
        | ModuleTypes.TWO_LINES_TEXT_BANNER;
    cta?: ICta;
    data:
        | I2LinesTextBannerData
        | I3LinesCtaData
        | IBalanceGridData
        | IBalanceGridData[]
        // | IIconData
        | IIconTwoLinesData
        | IImageBannerData
        | IOneLineTextBannerData
        | IScreenModuleColumnsWrapperData
        | IScreenModuleSelectableWrapperData
        | IScreenModuleWrapperData
        | ISeparatorData
        | IStaticTextColumnData[]
        | IThreeLinesIconData;
    details?: any; // ex. amount, validatorId, ...
}

export enum ModuleTypes {
    BALANCES_GRID_ICONS = 'balances-grid-icons',
    ICON = 'icon',
    ICON_TWO_LINES = 'icon-two-lines',
    IMAGE_BANNER = 'image-banner',
    MODULE_COLUMNS_WRAPPER = 'module-columns-wrapper',
    MODULE_SELECTABLE_WRAPPER = 'module-selectable-wrapper',
    MODULE_WRAPPER = 'module-wrapper',
    ONE_LINE_TEXT_BANNER = 'one_line_text_banner',
    SEPARATOR = 'separator',
    SINGLE_BALANCE_ICON = 'single-balance-icon',
    STATIC_TEXT_COLUMNS_BOTTOM_HEADER = 'static-text-columns-bottom-header',
    STATIC_TEXT_COLUMNS_TOP_HEADER = 'static-text-columns-top-header',
    THREE_LINES_CTA = '3-lines-cta',
    THREE_LINES_ICON = 'three-lines-icon',
    TWO_LINES_TEXT_BANNER = '2-lines-text-banner'
}

/// Screen Module Data Types \\\

export interface IScreenModuleWrapperData {
    state: string; // DEFAULT | PENDING | HIDDEN
    stateModifierFn: string;
    data: {
        [state: string]: Partial<IScreenModule>;
    };
}

export interface IScreenModuleSelectableWrapperData {
    state: string; //
    stateModifierFn: string;
    style?: {
        [state: string]: IDataStyle;
    };
    submodules: IScreenModule[];
}

export interface IScreenModuleColumnsWrapperData {
    style?: IDataStyle;
    submodules: IScreenModule[];
}

export enum DataType {
    TEXT = 'TEXT',
    CURRENCY = 'CURRENCY'
}

export interface ITextData {
    value: string | number;
    params?: {
        [param: string]: IData;
    };
}

export interface ICurrencyData {
    value: string;
    symbol: string;
    decimals?: number;
    round?: {
        decimals: number;
        type?: 'UP' | 'DOWN';
    };
    beautify?: {
        fromValue?: number;
        decimals: number;
    };
}

export interface IDataStyle {
    [key: string]:
        | string
        | number
        | {
              value: string | number;
              fn: 'normalize' | 'normalizeFontAndLineHeight';
          };
}

export interface IData {
    type: DataType;
    style?: IDataStyle;
    data: ITextData | ICurrencyData;
}

// Used for `3-lines-cta`
export interface I3LinesCtaData {
    firstLine: IData[];
    secondLine: IData[];
    thirdLine: IData[];
}

// Used for `static-text-columns-top-header` and `static-text-columns-bottom-header`
export interface IStaticTextColumnData {
    header: IData[];
    body: IData[];
}

// Used for`balances-grid-icons` and `single-balance-icon`
export interface IBalanceGridData {
    balance: IData[];
    label?: IData[];
    icon: {
        value: IconValues | string;
        color: string;
    };
}

export interface IImageBannerData {
    imageUrl: string;
}

export interface IOneLineTextBannerData {
    line: IData[];
}

export interface I2LinesTextBannerData {
    firstLine: IData[];
    secondLine: IData[];
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

export interface IIconTwoLinesData {
    firstLine: IData[];
    secondLine: IData[];
    icon: {
        url: string;
        style?: IDataStyle;
    };
}

// interface IIconData {
//     // state: string;
//     // data: {
//     //     [state: string]: {
//     //         value: IconValues;
//     //         style?: IDataStyle;
//     //     };
//     // };
// }

export interface IThreeLinesIconData {
    firstLine: IData[];
    secondLine: IData[];
    thirdLine: IData[];
    icon: {
        url: string;
        style?: IDataStyle;
    };
}
