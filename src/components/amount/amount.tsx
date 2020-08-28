import React from 'react';
import { Text } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { IReduxState } from '../../redux/state';
import { Blockchain } from '../../core/blockchain/types';
import { convertAmount } from '../../core/utils/balance';
import { IExchangeRates } from '../../redux/market/state';

interface IExternalProps {
    testID?: string;
    blockchain: Blockchain;
    amount: string;
    token: string;
    convert?: boolean; // if this is present will convert amount to user currency
    convertTo?: string; // if this is present will convert amount to this currency
    style?: any;
    tokenDecimals: number;
    uiDecimals?: number;
    isAnimated?: boolean;
}

export interface IReduxProps {
    exchangeRates: IExchangeRates;
    userCurrency: string;
}

export const AmountComponent = (props: IExternalProps & IReduxProps) => {
    const convertTo = props.convertTo || props.convert ? props.userCurrency : props.token;

    const amount = convertAmount(
        props.blockchain,
        props.exchangeRates,
        props.amount,
        props.token,
        convertTo,
        props.tokenDecimals
    );

    return (
        <Text
            testID={props.testID}
            style={props.style}
            format={{
                currency: convertTo,
                maximumFractionDigits: props.uiDecimals || 4
            }}
            isAnimated={props.isAnimated}
        >
            {amount}
        </Text>
    );
};

const mapStateToProps = (state: IReduxState) => ({
    exchangeRates: state.market.exchangeRates,
    userCurrency: state.preferences.currency
});

export const Amount = smartConnect<IExternalProps>(AmountComponent, [
    connect(mapStateToProps, null)
]);
