import React from 'react';
import { Text } from 'react-native';

import styles from './styles';

const formatter = /(\d)(?=(\d{3})+(?!\d))/g;

interface IProps {
    symbol?: string;
    decimals?: string;
    children: any;
}

const CurrencyFormat = (props: IProps) => {
    const value = parseFloat(props.children);
    let output = props.decimals ? value.toFixed(2) : '' + value;
    output = output.replace(formatter, '$1,');

    return <Text style={styles.text}>{output}</Text>;
};

export default CurrencyFormat;
