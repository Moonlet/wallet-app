import React from 'react';
import { View } from 'react-native';
import { TextSmall } from '../../library/text';
import { connect } from 'react-redux';
import { Convert } from '../convert/convert';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';

export interface IReduxProps {
    change: any;
}

export interface IProps {
    fromCurrency: string;
    toCurrency: string;
    styles: ReturnType<typeof stylesProvider>;
}

const mapStateToProps = (state: any) => ({
    change: state.market.change.daily
});

export const ConversionCardComponent = (props: IProps & IReduxProps) => {
    const change = props.change[props.fromCurrency][props.toCurrency];

    return (
        <View style={props.styles.container}>
            <TextSmall style={props.styles.conversionLabel}>
                {props.fromCurrency}
                {props.toCurrency}
            </TextSmall>
            <Convert from={props.fromCurrency} to={props.toCurrency} amount={1} />
            <TextSmall style={[change >= 0 ? props.styles.changeUp : props.styles.changeDown]}>
                {change}
            </TextSmall>
        </View>
    );
};

export const ConversionCard = connect(
    mapStateToProps,
    null
)(withTheme(ConversionCardComponent, stylesProvider));
