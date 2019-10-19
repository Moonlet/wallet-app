import { Platform, NativeModules } from 'react-native';

interface INumberFormatOptions {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

const significantDecimalsNumber = (amount: number) => (amount > 1 ? 2 : amount > 0.00001 ? 6 : 8);

// list of currencies to be displayed using js formatter
const formattedCurrencies = ['USD', 'EUR'];

export const formatNumber = (amount: number, options: INumberFormatOptions = {}) => {
    const locale =
        Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale
            : NativeModules.I18nManager.localeIdentifier;

    const displayFormatCurrency =
        options.currency && formattedCurrencies.indexOf(options.currency) !== -1;

    const formattedNumber = new Intl.NumberFormat(options.locale || locale || 'en-US', {
        style: displayFormatCurrency ? 'currency' : 'decimal',
        currency: displayFormatCurrency ? options.currency : undefined,
        minimumFractionDigits: options.minimumFractionDigits || 0,
        maximumFractionDigits: options.maximumFractionDigits || significantDecimalsNumber(amount)
    }).format(amount);

    return options.currency && !displayFormatCurrency
        ? formattedNumber + ' ' + options.currency
        : formattedNumber;
};
