import React from 'react';
import { Text } from '../../library';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';

export interface IProps {
    amount: BigNumber;
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
    const amount = (props.amount || new BigNumber(0)).multipliedBy(conversion);

    const formatOptions = props.displayCurrency
        ? {
              currency: props.to
          }
        : {};

    return (
        <Text style={props.style} format={formatOptions}>
            {amount.toString()}
        </Text>
    );
};

export const Convert = connect(mapStateToProps, null)(ConvertComponent);
