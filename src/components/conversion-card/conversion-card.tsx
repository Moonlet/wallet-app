import React from 'react';
import { View } from 'react-native';
import { Text, TextSmall } from '../../library/text';
import { connect } from 'react-redux';
import Convert from '../convert/convert';

import styles from './style.js';

interface IProps {
    fromCurrency: string;
    toCurrency: string;
    change: any;
}

const mapStateToProps = (state: any) => ({
    change: state.market.change.daily
});

const ConversionCard = (props: IProps) => {
    const change = props.change[props.fromCurrency][props.toCurrency] || 0;

    return (
        <View style={styles.container}>
            <TextSmall style={styles.conversionLabel}>
                {props.fromCurrency}
                {props.toCurrency}
            </TextSmall>
            <Convert from={props.fromCurrency} to={props.toCurrency}>
                1
            </Convert>
            <TextSmall style={[change >= 0 ? styles.changeUp : styles.changeDown]}>
                {change}
            </TextSmall>
        </View>
    );
};

export default connect(
    mapStateToProps,
    null
)(ConversionCard);
