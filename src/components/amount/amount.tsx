import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { IReduxState } from '../../redux/state';
import { Blockchain } from '../../core/blockchain/types';
import { convertAmount } from '../../core/utils/balance';
import { IExchangeRates } from '../../redux/market/state';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';

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
    smallFontToken?: boolean;
}

export interface IReduxProps {
    exchangeRates: IExchangeRates;
    userCurrency: string;
}

export const AmountComponent = (
    props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
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
        <View style={props.styles.container}>
            <Text
                testID={props.testID}
                style={props.style}
                format={{
                    currency: !props.smallFontToken && convertTo,
                    maximumFractionDigits: props.uiDecimals || 4
                }}
                isAnimated={props.isAnimated}
            >
                {amount}
            </Text>
            {props.smallFontToken && <Text style={props.styles.smallToken}>{convertTo}</Text>}
        </View>
    );
};

const mapStateToProps = (state: IReduxState) => ({
    exchangeRates: state.market.exchangeRates,
    userCurrency: state.preferences.currency
});

export const Amount = smartConnect<IExternalProps>(AmountComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
