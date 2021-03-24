import { Platform, NativeModules } from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/en-US';
import BigNumber from 'bignumber.js';
import { beautify } from '../../components/widgets/utils';
import { IBeautify } from '../../components/widgets/types';

export interface INumberFormatOptions {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    beautify?: IBeautify;
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
        let beautyNumber;

        if (options?.beautify?.notation === 'compact') {
            beautyNumber = beautify(amount, options?.beautify?.fromValue);
            amount = beautyNumber.value;
        }

        amount = amount instanceof BigNumber ? amount.toNumber() : Number(amount) || 0;

        const displayFormatCurrency =
            options.currency && formattedCurrencies.indexOf(options.currency) !== -1;

        let minimumFractionDigits = 0;
        if (options?.minimumFractionDigits) minimumFractionDigits = options.minimumFractionDigits;
        if (options?.beautify?.decimals) minimumFractionDigits = options.beautify.decimals;

        let maximumFractionDigits = significantDecimalsNumber(amount);
        if (options?.maximumFractionDigits) maximumFractionDigits = options.maximumFractionDigits;
        if (options?.beautify?.decimals !== undefined) {
            maximumFractionDigits = options.beautify.decimals;
        }

        const isPercent = options?.beautify?.notation === 'percent';

        let formattedNumber = new Intl.NumberFormat(options.locale || getLocale() || 'en-US', {
            style: isPercent ? 'percent' : displayFormatCurrency ? 'currency' : 'decimal',
            currency: isPercent ? undefined : displayFormatCurrency ? options.currency : undefined,
            minimumFractionDigits,
            maximumFractionDigits
        }).format(amount);

        if (options?.beautify?.notation === 'compact') {
            formattedNumber += beautyNumber.unit;
        }

        if (options?.beautify?.notation === 'percent') {
            // remove spaces
            formattedNumber = formattedNumber.replace(/\s/g, '');
        }

        return options.currency && !displayFormatCurrency
            ? formattedNumber +
                  ' ' +
                  (options?.beautify?.symbol ? options.beautify.symbol : options.currency)
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
