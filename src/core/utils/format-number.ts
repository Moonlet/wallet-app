import { Platform, NativeModules } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/en-US';
import BigNumber from 'bignumber.js';

export interface INumberFormatOptions {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

const significantDecimalsNumber = (amount: number) => (amount > 1 ? 2 : amount > 0.00001 ? 6 : 8);

// list of currencies to be displayed using js formatter
const formattedCurrencies = ['USD', 'EUR'];

const getLocale = () => {
    let deviceLocale: any;
    switch (Platform.OS) {
        case 'ios':
            deviceLocale = NativeModules.SettingsManager.settings.AppleLocale;
            break;
        case 'android':
            deviceLocale = NativeModules.I18nManager.localeIdentifier;
            break;
        case 'web':
            deviceLocale = window.navigator.language;
            break;
    }
    return deviceLocale ? deviceLocale.replace(/_/g, '-') : null;
};

export const formatNumber = (amount: number | BigNumber, options: INumberFormatOptions = {}) => {
    try {
        amount = amount instanceof BigNumber ? amount.toNumber() : Number(amount) || 0;
        const displayFormatCurrency =
            options.currency && formattedCurrencies.indexOf(options.currency) !== -1;

        const formattedNumber = new Intl.NumberFormat(options.locale || getLocale() || 'en-US', {
            style: displayFormatCurrency ? 'currency' : 'decimal',
            currency: displayFormatCurrency ? options.currency : undefined,
            minimumFractionDigits: options.minimumFractionDigits || 0,
            maximumFractionDigits:
                options.maximumFractionDigits || significantDecimalsNumber(amount)
        }).format(amount);

        return options.currency && !displayFormatCurrency
            ? formattedNumber + ' ' + options.currency
            : formattedNumber;
    } catch {
        // if something fails lets try with en-US locale
        // if that also fails, we return a N/A as we cannot format the number
        if (options.locale !== 'en-US') {
            return formatNumber(amount, { ...options, locale: 'en-US' });
        } else {
            return 'N/A';
        }
    }
};

const integerRegex = new RegExp(/^\d+$/);
export const isInteger = (value: string) => integerRegex.test(value);
