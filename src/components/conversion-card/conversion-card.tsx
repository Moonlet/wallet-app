import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { connect } from 'react-redux';
import { Convert } from '../convert/convert';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import BigNumber from 'bignumber.js';

export interface IReduxProps {
    change: any;
}

export interface IProps {
    fromCurrency: string;
    toCurrency: string;
}

const mapStateToProps = (state: any) => ({
    change: state.market.change.daily
});

export const ConversionCardComponent = (
    props: IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const change = props.change[props.fromCurrency][props.toCurrency];

    return (
        <View style={props.styles.container}>
            <Text style={[props.styles.text, props.styles.conversionLabel]}>
                {props.fromCurrency}
                {props.toCurrency}
            </Text>
            <Convert
                from={props.fromCurrency}
                to={props.toCurrency}
                amount={new BigNumber(1)}
                style={props.styles.convert}
            />
            <Text
                style={[
                    props.styles.text,
                    change >= 0 ? props.styles.changeUp : props.styles.changeDown
                ]}
            >
                {`${change}%`}
            </Text>
        </View>
    );
};

export const ConversionCard = smartConnect<IProps>(ConversionCardComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
