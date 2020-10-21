import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { CtaGroup } from '../../components/cta-group/cta-group';
import { Text } from '../../library';
import { Amount } from '../../components/amount/amount';
import { Blockchain } from '../../core/blockchain/types';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { INavigationProps, withNavigationParams } from '../../navigation/with-navigation-params';
import { SmartImage } from '../../library/image/smart-image';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { translate } from '../../core/i18n';
import { StatsComponent } from '../token/components/delegate-token/components/stats-component/stats-component';
import { IValidator, CardActionType } from '../../core/blockchain/types/stats';
import { ITokenState, IAccountState } from '../../redux/wallets/state';
import BigNumber from 'bignumber.js';
import { formatValidatorName } from '../../core/utils/format-string';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { IReduxState } from '../../redux/state';
import { getAccount } from '../../redux/wallets/selectors';
import { connect } from 'react-redux';

interface INavigationParams {
    validator: IValidator;
    blockchain: Blockchain;
    accountIndex: number;
    token: ITokenState;
    canPerformAction: boolean;
}

interface ReduxProps {
    account: IAccountState;
}

interface State {
    total: BigNumber;
}

const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => ({
    account: getAccount(state, ownProps.accountIndex, ownProps.blockchain)
});

const HeaderTitleComponent = (
    props: INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <SmartImage
                source={{ uri: props.navigation.state.params.validator.icon }}
                style={props.styles.navigationImage}
            />
            <View style={{ flexDirection: 'column' }}>
                <Text style={props.styles.labelName}>
                    {formatValidatorName(props.navigation.state.params.validator.name, 15)}
                </Text>
                <Text style={props.styles.website}>
                    {props.navigation.state.params.validator.website}
                </Text>
            </View>
        </View>
    );
};

const HeaderTitle = withTheme(stylesProvider)(HeaderTitleComponent);

const navigationOptions = ({ navigation }: any) => ({
    headerTitle: () => <HeaderTitle navigation={navigation} />
});

export class ValidatorScreenComponent extends React.Component<
    INavigationParams &
        ReduxProps &
        INavigationProps<INavigationParams> &
        IThemeProps<ReturnType<typeof stylesProvider>>,
    State
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { styles, blockchain, validator } = this.props;
        const config = getBlockchain(blockchain).config;

        const textTop =
            `${translate(config.ui.validator.totalLabel)}` +
            `${validator.rank ? ` (${validator.rank})` : ''}`;

        const amount = validator.totalVotes;
        const token = getTokenConfig(blockchain, config.coin);

        validator.actionType = CardActionType.CHECKBOX;
        validator.actionTypeSelected = true;

        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.topText}>{textTop}</Text>
                    <Amount
                        style={styles.title}
                        amount={amount}
                        token={token.symbol}
                        tokenDecimals={token.decimals}
                        blockchain={blockchain}
                        smallFontToken={{
                            visible: true,
                            wrapperStyle: {
                                marginVertical: BASE_DIMENSION
                            }
                        }}
                    />
                    <Amount
                        style={styles.subTitle}
                        amount={amount}
                        token={token.symbol}
                        tokenDecimals={token.decimals}
                        blockchain={blockchain}
                        convert
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <StatsComponent
                        accountStats={{
                            topStats: validator.topStats,
                            chartStats: validator.chartStats,
                            secondaryStats: validator.secondaryStats,
                            totalAmount: new BigNumber(0),
                            widgets: []
                        }}
                        blockchain={this.props.blockchain}
                        token={this.props.token}
                    />
                </View>

                <View style={styles.bottomContainer}>
                    <CtaGroup
                        mainCta={config.ui.token.validatorCTA.mainCta}
                        otherCtas={config.ui.token.validatorCTA.otherCtas}
                        params={{
                            accountIndex: this.props.accountIndex,
                            blockchain: this.props.blockchain,
                            token: this.props.token,
                            validators: [validator],
                            canPerformAction: this.props.canPerformAction
                        }}
                    />
                </View>
            </View>
        );
    }
}

export const ValidatorScreen = smartConnect(ValidatorScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider),
    withNavigationParams()
]);
