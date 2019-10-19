import React from 'react';
import { Text } from '../../library/text';
import { connect } from 'react-redux';

export interface IProps {
    amount: number;
    from: string;
    to: string;
    usdPrices: any;
    displayCurrency?: boolean;
    decimals?: number;
    style?: any;
}

export interface IReduxProps {
    usdPrices: any;
}

const mapStateToProps = (state: any) => ({
    usdPrices: state.market.usdPrices
});

export const ConvertComponent = (props: IProps & IReduxProps) => {
    const conversion = props.usdPrices[props.from] / props.usdPrices[props.to] || 0;
    const amount = (props.amount || 0) * conversion;

    const formatOptions = props.displayCurrency
        ? {
              currency: props.to
          }
        : {};

    return (
        <Text style={props.style} format={formatOptions}>
            {amount}
        </Text>
    );
};

export const Convert = connect(
    mapStateToProps,
    null
)(ConvertComponent);
