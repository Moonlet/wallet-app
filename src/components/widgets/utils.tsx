import React from 'react';
import { DataType, ICurrencyData, IData, IDataStyle, ITextData } from './types';
import { Text } from '../../library';
import BigNumber from 'bignumber.js';
import { formatNumber } from '../../core/utils/format-number';
import { normalize, normalizeFontAndLineHeight } from '../../styles/dimensions';

const formatTextData = (data: ITextData): string => {
    let text = '';
    // Static text
    text = String(data.value);

    if (data?.params) {
        // TODO
    }

    // Translated text
    // TODO

    return text;
};

const amountFromStd = (value: BigNumber | number | string, decimals: number): BigNumber => {
    return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals));
};

const formatCurrencyData = (data: ICurrencyData): string => {
    let text = '';
    let value = data.value;

    if (data?.decimals) {
        value = amountFromStd(value, data.decimals).toFixed();
    }

    text = formatNumber(Number(value), {
        currency: data.symbol,
        maximumFractionDigits: data?.round?.decimals
    });

    if (data?.beautify) {
        const out = beautify(value);
        text = new BigNumber(out.value).toFixed(data.beautify.decimals) + out.unit;
    }

    return text;
};

const formatStyles = (style: IDataStyle): { [key: string]: string | number } => {
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
        } else {
            finalStyle[s] = style[s];
        }
    }

    return finalStyle;
};

const beautify = (
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

export const formatDataJSXElements = (data: IData | IData[], baseStyle: any): JSX.Element[] => {
    if (!Array.isArray(data)) {
        data = [data];
    }

    const finalData: JSX.Element[] = [];

    for (const d of data) {
        switch (d.type) {
            case DataType.TEXT:
                finalData.push(
                    <Text style={[baseStyle, d?.style && formatStyles(d.style)]}>
                        {formatTextData(d.data as ITextData)}
                    </Text>
                );
                break;

            case DataType.CURRENCY:
                finalData.push(
                    <Text style={[baseStyle, d?.style && formatStyles(d.style)]}>
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
