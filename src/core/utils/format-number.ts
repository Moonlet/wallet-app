import { Platform, NativeModules } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/en-US';

interface INumberFormatOptions {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

const significantDecimalsNumber = (amount: number) => (amount > 1 ? 2 : amount > 0.00001 ? 6 : 8);

// list of currencies to be displayed using js formatter
const formattedCurrencies = ['USD', 'EUR'];

const deviceLocale =
    Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale
        : Platform.OS === 'android'
        ? NativeModules.I18nManager.localeIdentifier
        : window.navigator.language;

const detectedLocale = deviceLocale ? deviceLocale.replace(/_/g, '-') : null;

export const formatNumber = (amount: number, options: INumberFormatOptions = {}) => {
    const displayFormatCurrency =
        options.currency && formattedCurrencies.indexOf(options.currency) !== -1;

    const formattedNumber = new Intl.NumberFormat(options.locale || detectedLocale || 'en-US', {
        style: displayFormatCurrency ? 'currency' : 'decimal',
        currency: displayFormatCurrency ? options.currency : undefined,
        minimumFractionDigits: options.minimumFractionDigits || 0,
        maximumFractionDigits: options.maximumFractionDigits || significantDecimalsNumber(amount)
    }).format(amount);

    return options.currency && !displayFormatCurrency
        ? formattedNumber + ' ' + options.currency
        : formattedNumber;
};
