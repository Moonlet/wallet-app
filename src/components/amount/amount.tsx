import React from 'react';
import { Text } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { IReduxState } from '../../redux/state';
import { Blockchain } from '../../core/blockchain/types';
import { convertAmount } from '../../core/utils/balance';
import { IExchangeRates } from '../../redux/market/state';
import stylesProvider from './styles';
import { IThemeProps, withTheme } from '../../core/theme/with-theme';
import { subscribeExchangeRateValue } from '../../core/utils/exchange-rates';
import { updateExchangeRate } from '../../redux/market/actions';

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
    smallFontToken?: {
        visible: boolean;
        wrapperStyle?: any;
    };
    numberOfLines?: number;
}

interface IReduxProps {
    exchangeRates: IExchangeRates;
    userCurrency: string;
}

const mapStateToProps = (state: IReduxState) => ({
    exchangeRates: state.market.exchangeRates,
    userCurrency: state.preferences.currency
});

class AmountComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public componentDidMount() {
        subscribeExchangeRateValue(this.props.token);
        subscribeExchangeRateValue(this.props.convertTo);
        subscribeExchangeRateValue(this.props.userCurrency);
    }

    public componentDidUpdate(prevProps: IExternalProps & IReduxProps) {
        if (this.props.token !== prevProps.token) {
            subscribeExchangeRateValue(this.props.token);
        }

        if (this.props.convertTo !== prevProps.convertTo) {
            subscribeExchangeRateValue(this.props.convertTo);
        }

        if (this.props.userCurrency !== prevProps.userCurrency) {
            subscribeExchangeRateValue(this.props.userCurrency);
        }
    }

    private renderPrimaryAmountComp(convertTo: string) {
        const { style } = this.props;

        const amount = convertAmount(
            this.props.blockchain,
            this.props.exchangeRates,
            this.props.amount,
            this.props.token,
            convertTo,
            this.props.tokenDecimals
        );

        return (
            <Text
                testID={this.props.testID}
                style={style}
                format={{
                    currency: !this.props.smallFontToken?.visible === true && convertTo,
                    maximumFractionDigits: this.props.uiDecimals || 4
                }}
                isAnimated={this.props.isAnimated}
                numberOfLines={this.props.numberOfLines}
            >
                {amount}
            </Text>
        );
    }

    public render() {
        const convertTo =
            this.props.convertTo || this.props.convert ? this.props.userCurrency : this.props.token;

        if (this.props.smallFontToken?.visible === true) {
            return (
                <Text style={this.props.smallFontToken?.wrapperStyle}>
                    {this.renderPrimaryAmountComp(convertTo)}
                    {<Text style={this.props.styles.smallToken}>{` ${convertTo}`}</Text>}
                </Text>
            );
        } else {
            return this.renderPrimaryAmountComp(convertTo);
        }
    }
}

export const Amount = smartConnect<IExternalProps>(AmountComponent, [
    connect(mapStateToProps),
    withTheme(stylesProvider)
]);
