import { Blockchain } from '../../core/blockchain/types';
import { handleCta } from '../../redux/ui/screens/data/handle-cta';
import { AccountType } from '../../redux/wallets/state';
import { IconValues } from '../icon/values';
import {
    clearScreenInputData,
    runScreenValidation,
    runScreenStateActions,
    setScreenInputData
} from '../../redux/ui/screens/input-data/actions';

export interface IScreenRequest {
    context: IScreenContext;
    user: IScreenUser;
}

export interface IScreenContext<ScreenParams = any> {
    screen: string;
    step?: string;
    tab?: string;
    flowId?: string;
    params?: ScreenParams;
    flowData?: any;
}

export interface IScreenCtaContextParams<F = any, S = any, E = any> {
    ctaId: string;
    flowInputData: F;
    screenInputData: S;
    extraParams?: E;
}

/** @deprecated use string instead */
export enum ContextScreen {
    DASHBOARD = 'dashboard',
    TOKEN = 'token',
    QUICK_STAKE_SELECT_VALIDATOR = 'quickStakeSelectValidator'
}

/** @deprecated use string instead */
export enum ContextTab {
    ACCOUNT = 'account'
}

export interface ISmartScreenActions {
    handleCta?: typeof handleCta;
    clearScreenInputData?: typeof clearScreenInputData;
    runScreenValidation?: typeof runScreenValidation;
    runScreenStateActions?: typeof runScreenStateActions;
    setScreenInputData?: typeof setScreenInputData;
}

export enum SmartScreenPubSubEvents {
    SCROLL_TO_END = 'scrollToEnd',
    COLLAPSE_ALL = 'collapseAll'
}

export interface IScreenUser {
    os: 'android' | 'ios' | 'web';
    deviceId: string;
    preferedCurrency: string;
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
    bottomFixedArea?: IScreenWidget;
    validation?: IScreenValidation;
    navigationOptions?: any;
}

export interface IScreenCtaResponse {
    cta: ICta;
}

export interface IScreenFieldValidation {
    fn: string;
    params?: any[];
    messages?: {
        [key: string]: {
            type: string;
            message: string;
        };
    };
}

export interface IScreenValidation {
    validators: {
        [field: string]: IScreenFieldValidation[];
    };
}

export interface ICtaAction<P = any> {
    type: 'callAction' | 'openUrl' | 'navigateTo' | 'onBack' | 'navigationOnPop';
    params: {
        action?: string;
        url?: string;
        count?: string;
        screen?: string;
        params?: P;
    };
}

export interface ICta {
    actions?: ICtaAction[];

    /** @deprecated use actions instead */
    type?: 'callAction' | 'openUrl' | 'navigateTo';

    /** @deprecated use actions instead */
    params?: {
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
        disabledSecondary?: boolean;

        colors?: {
            /** @deprecated use textStyle instead */
            label?: string;

            bg?: string;
        };

        leftIcon?: IconValues;

        wrapperStyle?: any;
        buttonStyle?: any;
        textStyle?: any;
    };

    // TODO: check this
    screenDataValidation?: {
        context: IScreenContext; // not sure if needed
    };
}

export interface IScreenWidget {
    title?:
        | string
        | {
              value: string;
              containerStyle?: IDataStyle;
              textStyle?: IDataStyle;
              iconStyle?: IDataStyle;
          };
    expandable?: boolean;
    initialState?: 'collapsed' | 'expanded';
    style?: IDataStyle;
    modules: IScreenModule[];
    cta?: ICta;
    hideExpandableIcon?: boolean;
}

export interface IScreenModule {
    displayWhen?: 'collapsed' | 'expanded'; // if undefined, it will be displayed always
    hidden?: boolean;
    style?: IDataStyle;
    type:
        | ModuleTypes.ABSOLUTE_MODULES
        | ModuleTypes.AMOUNT_INPUT
        | ModuleTypes.AMOUNT_SELECTABLE_BOX
        | ModuleTypes.BALANCES_GRID_ICONS
        | ModuleTypes.CTA
        | ModuleTypes.GRADIENT_WRAPPER
        | ModuleTypes.ICON_ONE_LINE
        | ModuleTypes.ICON
        | ModuleTypes.ICON_TWO_LINES
        | ModuleTypes.IMAGE_BANNER
        | ModuleTypes.INPUT
        | ModuleTypes.TIMER_INTERVAL_PRICE_UPDATE
        | ModuleTypes.MD_TEXT
        | ModuleTypes.MODULE_COLUMNS_WRAPPER
        | ModuleTypes.MODULE_SELECTABLE_WRAPPER
        | ModuleTypes.MODULE_WRAPPER
        | ModuleTypes.ONE_LINE_TEXT_BANNER
        | ModuleTypes.PRICE_UPDATE
        | ModuleTypes.PROGRESS_BAR
        | ModuleTypes.SEPARATOR
        | ModuleTypes.SINGLE_BALANCE_ICON
        | ModuleTypes.STATIC_TEXT_COLUMNS_BOTTOM_HEADER
        | ModuleTypes.STATIC_TEXT_COLUMNS_TOP_HEADER
        | ModuleTypes.TEXT_LINE_ICON
        | ModuleTypes.THREE_LINES_CTA
        | ModuleTypes.THREE_LINES_ICON
        | ModuleTypes.TWO_LINES_TEXT_BANNER
        | ModuleTypes.VALIDATIONS;
    cta?: ICta;
    data:
        | I2LinesTextBannerData
        | I3LinesCtaData
        | IAmountInputData
        | IAmountSelectableBoxData
        | IBalanceGridData
        | IBalanceGridData[]
        | IGradientWrapperData
        | IIconData
        | IIconTwoLinesData
        | IIconOneLineData
        | IImageBannerData
        | IInputData
        | IMdTextData
        | IOneLineTextBannerData
        | IScreenModuleColumnsWrapperData
        | IScreenModuleSelectableWrapperData
        | IScreenModuleWrapperData
        | ISeparatorData
        | IStaticTextColumnData[]
        | IThreeLinesIconData;
    details?: any; // ex. amount, validatorId, ...
    info?: {
        position?: string; // 'top-right' is default
        style?: IDataStyle;
        data: IScreenModule;
    };

    state: {
        // uiStateSelector?: IStateSelector, // aka state modifier - not implemented now
        actions?: IStateSelector[];
        selectors: {
            [key: string]: IStateSelector;
        };
    };
}

export interface IStateSelector {
    fn: string;
    params?: any[];
}

export enum ModuleTypes {
    ABSOLUTE_MODULES = 'absolute-modules',
    AMOUNT_INPUT = 'amount-input',
    AMOUNT_SELECTABLE_BOX = 'amount-selectable-box',
    BALANCES_GRID_ICONS = 'balances-grid-icons',
    CTA = 'cta',
    GRADIENT_WRAPPER = 'gradient-wrapper',
    ICON_ONE_LINE = 'cta-one-line',
    ICON = 'icon',
    ICON_TWO_LINES = 'icon-two-lines',
    IMAGE_BANNER = 'image-banner',
    INPUT = 'input',
    TIMER_INTERVAL_PRICE_UPDATE = 'timer-interval-price-update',
    MD_TEXT = 'md-text',
    MODULE_COLUMNS_WRAPPER = 'module-columns-wrapper',
    MODULE_SELECTABLE_WRAPPER = 'module-selectable-wrapper',
    MODULE_WRAPPER = 'module-wrapper',
    ONE_LINE_TEXT_BANNER = 'one_line_text_banner',
    PRICE_UPDATE = 'price-update',
    PROGRESS_BAR = 'progress-bar',
    SEPARATOR = 'separator',
    SINGLE_BALANCE_ICON = 'single-balance-icon',
    STATIC_TEXT_COLUMNS_BOTTOM_HEADER = 'static-text-columns-bottom-header',
    STATIC_TEXT_COLUMNS_TOP_HEADER = 'static-text-columns-top-header',
    TEXT_LINE_ICON = 'text-line-icon',
    THREE_LINES_CTA = '3-lines-cta',
    THREE_LINES_ICON = 'three-lines-icon',
    TWO_LINES_TEXT_BANNER = '2-lines-text-banner',
    VALIDATIONS = 'validations'
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
    beautify?: IBeautify;
}

export interface IBeautify {
    fromValue?: number;
    decimals?: number;
    symbol?: string;
    notation?: 'compact' | 'percent';
}

export interface IDataStyle {
    [key: string]:
        | string
        | number
        | {
              value: string | number;
              fn: 'normalize' | 'normalizeFontAndLineHeight' | 'gradient';
          };
}

export interface IData {
    type: DataType;
    style?: IDataStyle;
    data: ITextData | ICurrencyData;
}

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
    image: IImageInfo;
}

export interface IImageInfo {
    url: string;
    width: number;
    height: number;
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

export interface ISeparatorData {
    color?: string;
}

export interface IIconTwoLinesData {
    firstLine: IData[];
    secondLine: IData[];
    icon?: {
        url: string;
        style?: IDataStyle;
    };
}

export interface IIconData {
    icon: IconValues;
}

export interface IPriceUpdateData {
    endpoint: {
        url: string;
        method: 'POST' | 'GET';
        data: any;
    };
    reduxKey: string;
    interval: number; // miliseconds
}

export interface ITimerUpdateData {
    numSeconds: number;
    reduxKey: string;
    endpoint: {
        url: string;
        method: 'POST' | 'GET';
        data: any;
    };
    cta: ICta;
    interval: number; // miliseconds
}

export interface IThreeLinesIconData {
    firstLine: IData[];
    secondLine: IData[];
    thirdLine: IData[];
    icon: {
        url: string;
        style?: IDataStyle;
    };
}

export interface IMdTextData {
    text: string;
    style?: any;
}

/**
 * value: +0.1 | half | all
 * percentage: 10%
 */
export interface IAmountInputAmountBox {
    type: 'value' | 'percentage';
    value: string | number;
    // label: string;
}

export interface IAmountInputData {
    input?: {
        style?: IDataStyle;
        textStyle?: IDataStyle;
    };
    labels?: IData[];
    amounts?: IAmountInputAmountBox[];
    placeholder?: {
        value: string;
        color?: string;
    };
    editable?: boolean;
    focus?: boolean;
    showValidations?: boolean;
    onChangeTextAction?: IStateSelector;
}

export interface IAmountSelectableBoxData {
    amounts: IAmountInputAmountBox[];
}

export interface IIconOneLineData {
    icon: {
        value: IconValues;
        style?: IDataStyle;
    };
    line: IData[];
}

export interface IInputData {
    style?: {
        input?: IDataStyle;
        inputContainer?: IDataStyle;
    };
    options?: {
        keyboardType?: string;
        placeholder?: {
            value: string;
            color?: string;
        };
        multiline?: boolean;
    };
}

export interface IGradientWrapperData {
    gradient: string[];
    submodules: IScreenModule[];
}

export interface IProgressBarData {
    percentage: number;
    backgroundStyle?: IDataStyle;
    barStyle?: IDataStyle;
}

export interface ITextLineIconData {
    icon: {
        value: IconValues;
        style?: IDataStyle;
    };
    line: IData[];
    lineStyle?: IDataStyle;
}

export interface IValidationData {
    fieldName?: string;
}

export interface IAbsoluteModulesData {
    module1: {
        module: IScreenModule;
        style?: IDataStyle;
    };
    module2: {
        module: IScreenModule;
        style?: IDataStyle;
    };
}
