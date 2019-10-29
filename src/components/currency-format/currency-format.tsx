import React from 'react';
import { Text } from '../../library';

const formatter = /(\d)(?=(\d{3})+(?!\d))/g;

interface IProps {
    symbol?: string;
    decimals?: string;
    children: any;
    style?: any;
}

export const CurrencyFormat = (props: IProps) => {
    const value = parseFloat(props.children);
    let output = props.decimals ? value.toFixed(2) : '' + value;
    output = output.replace(formatter, '$1,');

    return <Text style={props.style}>{output}</Text>;
};

export default CurrencyFormat;
