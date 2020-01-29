import React from 'react';
import { Text } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { IReduxState } from '../../redux/state';
import { Blockchain } from '../../core/blockchain/types';
import { convertAmount } from '../../core/utils/balance';

interface IExternalProps {
    blockchain: Blockchain;
    amount: string;
    token: string;
    convert?: boolean; // if this is present will convert amount to user currency
    convertTo?: string; // if this is present will convert amount to this currency
    style?: any;
    tokenDecimals: number;
    uiDecimals?: number;
}

export interface IReduxProps {
    exchangeRates: any;
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
            style={props.style}
            format={{
                currency: convertTo,
                maximumFractionDigits: props.uiDecimals || 4
            }}
        >
            {amount}
        </Text>
    );
};

const mapStateToProps = (state: IReduxState) => ({
    exchangeRates: (state as any).market.exchangeRates,
    userCurrency: state.preferences.currency
});

export const Amount = smartConnect<IExternalProps>(AmountComponent, [
    connect(mapStateToProps, null)
]);
