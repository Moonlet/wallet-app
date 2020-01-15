import React from 'react';
import { Text } from '../../library';
import BigNumber from 'bignumber.js';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { IReduxState } from '../../redux/state';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { Blockchain } from '../../core/blockchain/types';

interface IExternalProps {
    blockchain: Blockchain;
    amount: BigNumber;
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

const convertAmount = (
    blockchain: Blockchain,
    exchangeRates: any,
    value: BigNumber,
    fromToken: string,
    toToken: string,
    tokenDecimals: number
): BigNumber => {
    const blockchainInstance = getBlockchain(blockchain);
    const amount = blockchainInstance.account.amountFromStd(value, tokenDecimals);

    if (fromToken === toToken) {
        return amount;
    }

    if (value && exchangeRates[fromToken]) {
        if (exchangeRates[fromToken][toToken]) {
            // direct conversion is possible
            return amount.multipliedBy(exchangeRates[fromToken][toToken]);
        } else {
            // direct conversion not possible
            const avTokens = Object.keys(exchangeRates[fromToken]);
            for (const avToken of avTokens) {
                if (exchangeRates[avToken] && exchangeRates[avToken][toToken]) {
                    return amount
                        .multipliedBy(exchangeRates[fromToken][avToken])
                        .multipliedBy(exchangeRates[avToken][toToken]);
                }
            }
        }
    }

    return new BigNumber(0);
};

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
