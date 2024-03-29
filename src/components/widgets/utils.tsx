import React from 'react';
import { DataType, ICurrencyData, IData, IDataStyle, ITextData } from './types';
import { Text } from '../../library';
import BigNumber from 'bignumber.js';
import { formatNumber } from '../../core/utils/format-number';
import { normalize, normalizeFontAndLineHeight } from '../../styles/dimensions';
import { formatTranslate } from '../../core/i18n';

const formatTextData = (
    data: ITextData,
    translationKeys?: {
        [key: string]: string;
    }
): string => {
    let text = '';

    if (data?.params) {
        // Translated text
        const translateKeys = {};

        for (const param of Object.keys(data.params)) {
            const val = data.params[param];

            if (val.type === DataType.TEXT) {
                translateKeys[param] = formatTextData(val.data as ITextData, translateKeys);
            }

            if (val.type === DataType.CURRENCY) {
                translateKeys[param] = formatCurrencyData(val.data as ICurrencyData);
            }
        }

        text = formatTranslate(String(data.value), translateKeys);
    } else {
        // Static text
        text = String(data.value);

        if (translationKeys) {
            text = formatTranslate(text, translationKeys);
        }
    }

    return text;
};

const amountFromStd = (value: BigNumber | number | string, decimals: number): BigNumber => {
    return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals));
};

const formatCurrencyData = (data: ICurrencyData): string => {
    let text = '';
    let value: BigNumber = new BigNumber(data.value);

    if (data?.decimals) {
        value = amountFromStd(value, data.decimals);
    }

    if (data?.round?.type) {
        let rounded: string;

        switch (data.round.type) {
            case 'UP':
                rounded = value.toFixed(data.round.decimals, BigNumber.ROUND_UP);
                break;

            case 'DOWN':
                rounded = value.toFixed(data.round.decimals, BigNumber.ROUND_DOWN);
                break;

            default:
                rounded = value.toFixed(data.round.decimals);
                break;
        }

        text = formatNumber(new BigNumber(rounded), {
            currency: data.symbol,
            maximumFractionDigits: data?.round?.decimals,
            beautify: data?.beautify
        });
    } else {
        text = formatNumber(Number(value), {
            currency: data.symbol,
            maximumFractionDigits: data?.round?.decimals,
            beautify: data?.beautify
        });
    }

    return text;
};

export const formatStyles = (style: IDataStyle): { [key: string]: string | number } => {
    if (!style) return {};

    const finalStyle = {};

    for (const s of Object.keys(style)) {
        const sVal: any = style[s];

        if (typeof sVal === 'object') {
            if (sVal.fn === 'normalize') {
                finalStyle[s] = normalize(sVal.value);
            }
            if (sVal.fn === 'normalizeFontAndLineHeight') {
                finalStyle[s] = normalizeFontAndLineHeight(sVal.value);
            }
            if (sVal.fn === 'gradient') {
                try {
                    finalStyle[s] = JSON.parse(sVal.value);
                } catch {
                    // maybe return a default gradient theme
                }
            }
        } else {
            finalStyle[s] = style[s];
        }
    }

    return finalStyle;
};

export const beautify = (
    value: BigNumber | string | number,
    fromValue?: number
): {
    value: BigNumber | string;
    unit: string;
} => {
    fromValue = fromValue || 1000;

    value = new BigNumber(value);

    let out = { value, unit: '' };

    if (value.gte(fromValue)) {
        const units = [
            [1000000000, 'B'],
            [1000000, 'M'],
            [1000, 'k']
        ];

        for (const unit of units) {
            if (value.gte(unit[0])) {
                out = {
                    value: value.div(unit[0]),
                    unit: unit[1].toString()
                };
                break;
            }
        }
    }

    return out;
};

export const formatDataJSXElements = (
    data: IData | IData[],
    baseStyle: any,
    options?: {
        translateKeys?: {
            [key: string]: string;
        };
    }
): JSX.Element[] => {
    if (!Array.isArray(data)) {
        data = [data];
    }

    const finalData: JSX.Element[] = [];

    for (const [index, d] of data.entries()) {
        switch (d.type) {
            case DataType.TEXT:
                finalData.push(
                    <Text
                        key={`data-text-${index}`}
                        style={[baseStyle, d?.style && formatStyles(d.style)]}
                    >
                        {formatTextData(d.data as ITextData, options?.translateKeys)}
                    </Text>
                );
                break;

            case DataType.CURRENCY:
                finalData.push(
                    <Text
                        key={`data-currency-${index}`}
                        style={[baseStyle, d?.style && formatStyles(d.style)]}
                    >
                        {formatCurrencyData(d.data as ICurrencyData)}
                    </Text>
                );
                break;

            default:
                break;
        }
    }

    return finalData;
};
