export enum ModuleTypes {
    STATIC_TEXT_COLUMNS_TOP_HEADER = 'static-text-columns-top-header',
    STATIC_TEXT_COLUMNS_BOTTOM_HEADER = 'static-text-columns-bottom-header',
    THREE_LINES_CTA = '3-lines-cta',
    BALANCES_GRID_ICONS = 'balances-grid-icons',
    SINGLE_BALANCE_ICON = 'single-balance-icon',
    SEPARATOR = 'separator'
}

export interface IWidget {
    title?: string;
    expandable?: boolean;
    initialState?: 'collapsed' | 'expanded';
    modules: IModules[];
}

export interface IModules {
    displayWhen?: 'expanded' | 'collapsed';
    type:
        | '3-lines-cta'
        | 'static-text-columns-top-header'
        | 'static-text-columns-bottom-header'
        | 'balances-grid-icons'
        | 'single-balance-icon'
        | 'image-banner'
        | '2-lines-text-banner'
        | 'separator';
    cta?: ICTA;
    data:
        | I3LinesCtaData[]
        | IStaticTextColHeaderData[]
        | IBalancesGridIconsData[]
        | ISingleBalanceIconData[]
        | IImageBannerData[]
        | I2LinesTextBannerData[]
        | ISeparatorData[];
}

export interface ICTA {
    type: 'callAction' | 'openUrl' | 'navigateTo';
    params: {
        action?: string;
        url?: string;
        screen?: string;
        params?: any;
    };
    label: string;
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

export interface I3LinesCtaData {
    firstLine: string;
    secondLine: string;
    thirdLine: string;
}

export interface IStaticTextColHeaderData {
    headerValue: string;
    secondaryValue: string;
    secondaryColor?: string;
}

export interface IBalancesGridIconsData {
    firstLine: string;
    secondLine: string;
    icon: {
        value: string; // IconValues
        color: string;
    };
}

export interface ISingleBalanceIconData {
    title: string;
    icon: {
        value: string; // IconValues
        color: string;
    };
}

export interface IImageBannerData {
    uri: string;
    url: string;
}

export interface I2LinesTextBannerData {
    firstLine: string;
    secondLine: string;
    icon?: string; // IconValues
}

export interface ISeparatorData {
    color?: string;
}
