import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { connect } from 'react-redux';

import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { Amount } from '../amount/amount';
import { Blockchain } from '../../core/blockchain/types';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';

export interface IReduxProps {
    change: any;
}

export interface IProps {
    fromCurrency: string;
    toCurrency: string;
    blockchain: Blockchain;
}

const mapStateToProps = (state: any) => ({
    change: state.market.change.daily
});

export const ConversionCardComponent = (
    props: IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    var change = 0;
    if (props.change[props.fromCurrency] && props.change[props.fromCurrency][props.toCurrency])
        change = props.change[props.fromCurrency][props.toCurrency];

    return (
        <View style={props.styles.container}>
            <Text style={[props.styles.text, props.styles.conversionLabel]}>
                {props.fromCurrency}
                {props.toCurrency}
            </Text>
            <Amount
                amount={'1'}
                token={props.fromCurrency}
                style={props.styles.convert}
                convertTo={props.toCurrency} // not working
                blockchain={props.blockchain}
                tokenDecimals={
                    getBlockchain(props.blockchain).config.tokens[
                        getBlockchain(props.blockchain).config.coin
                    ].decimals
                }
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
