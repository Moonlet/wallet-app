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
import { ITokenState } from '../../redux/wallets/state';
import BigNumber from 'bignumber.js';
import { formatValidatorName } from '../../core/utils/format-string';
import { BASE_DIMENSION } from '../../styles/dimensions';

interface INavigationParams {
    validator: IValidator;
    blockchain: Blockchain;
    accountIndex: number;
    token: ITokenState;
    canPerformAction: boolean;
}

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
        INavigationProps<INavigationParams> &
        IThemeProps<ReturnType<typeof stylesProvider>>
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

        const otherCtas = config.ui.token.validatorCTA.otherCtas;
        if (blockchain === Blockchain.ZILLIQA) {
            otherCtas.map(cta =>
                cta.title === 'App.labels.switchNode'
                    ? (cta.navigateTo.params.context = {
                          ...cta.navigateTo.params.context,
                          params: {
                              fromValidatorId: validator.id
                          }
                      })
                    : cta
            );
        }

        const mainCta = config.ui.token.validatorCTA.mainCta;
        mainCta.navigateTo.params = {
            ...mainCta.navigateTo.params,
            context: {
                ...mainCta.navigateTo.params?.context,
                params: {
                    ...mainCta.navigateTo.params?.context?.params,
                    validatorId: validator.id
                }
            }
        };

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
                        mainCta={mainCta}
                        otherCtas={otherCtas}
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
    withTheme(stylesProvider),
    withNavigationParams()
]);
