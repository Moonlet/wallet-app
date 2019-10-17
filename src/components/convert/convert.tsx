import React from 'react';
import { Text } from '../../library/text';
import { connect } from 'react-redux';

import styles from './style.js';

interface IProps {
    from: string;
    to: string;
    children: any;
    usdPrices: any;
    decimals?: number;
    style?: any;
}

const mapStateToProps = (state: any) => ({
    usdPrices: state.market.usdPrices
});

// TODO: add currecy formatter
const roundToDecimals = (value: number, decimals: number) =>
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

const Convert = (props: IProps) => {
    const conversion = props.usdPrices[props.from] / props.usdPrices[props.to] || 0;
    const amount = (parseFloat(props.children) || 0) * conversion;
    const decimals = props.decimals ? props.decimals : amount > 1 ? 2 : 6;

    return <Text style={props.style}>{roundToDecimals(amount, decimals)}</Text>;
};

export default connect(
    mapStateToProps,
    null
)(Convert);
