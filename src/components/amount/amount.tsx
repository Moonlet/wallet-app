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
import { subscribeExchangeRate } from '../../core/utils/exchange-rates';
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
    updateExchangeRate: typeof updateExchangeRate;
}

const mapStateToProps = (state: IReduxState) => ({
    exchangeRates: state.market.exchangeRates,
    userCurrency: state.preferences.currency
});

const mapDispatchToProps = {
    updateExchangeRate
};

export class AmountComponent extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public componentDidMount() {
        this.subscribeUpdateExchangeRate(this.props.token);
        this.subscribeUpdateExchangeRate(this.props.convertTo);
        this.subscribeUpdateExchangeRate(this.props.userCurrency);
    }

    public componentDidUpdate(prevProps: IExternalProps & IReduxProps) {
        if (this.props.token !== prevProps.token) {
            this.subscribeUpdateExchangeRate(this.props.token);
        }

        if (this.props.convertTo !== prevProps.convertTo) {
            this.subscribeUpdateExchangeRate(this.props.convertTo);
        }

        if (this.props.userCurrency !== prevProps.userCurrency) {
            this.subscribeUpdateExchangeRate(this.props.userCurrency);
        }
    }

    private subscribeUpdateExchangeRate(token: string) {
        // Subscribe only if the rate does not exist
        if (token && (!this.props.exchangeRates || !this.props.exchangeRates[token])) {
            subscribeExchangeRate(token, (exchangeRate: number) => {
                if (exchangeRate) {
                    // TODO: maybe add an interval after some time (e.g. 15 min) and fetch again the value
                    this.props.updateExchangeRate({
                        token,
                        value: exchangeRate
                    });
                }
            });
        }
    }

    public render() {
        const { style } = this.props;

        const convertTo =
            this.props.convertTo || this.props.convert ? this.props.userCurrency : this.props.token;

        const amount = convertAmount(
            this.props.blockchain,
            this.props.exchangeRates,
            this.props.amount,
            this.props.token,
            convertTo,
            this.props.tokenDecimals
        );

        const renderPrimaryAmountComp = () => (
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

        if (this.props.smallFontToken?.visible === true) {
            return (
                <Text style={this.props.smallFontToken?.wrapperStyle}>
                    {renderPrimaryAmountComp()}
                    {<Text style={this.props.styles.smallToken}>{` ${convertTo}`}</Text>}
                </Text>
            );
        } else {
            return renderPrimaryAmountComp();
        }
    }
}

export const Amount = smartConnect<IExternalProps>(AmountComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
