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
import { DelegationType } from '../../core/blockchain/types/token';
import { ITokenState } from '../../redux/wallets/state';

export interface INavigationParams {
    validator: IValidator;
    blockchain: Blockchain;
    accountIndex: number;
    token: ITokenState;
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
                    {props.navigation.state.params.validator.name}
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

        const textTop = `${translate(config.ui.validator.totalLabel)} (${validator.rank})`;
        const amount = validator.amountDelegated;
        const token = getTokenConfig(blockchain, config.coin);

        validator.actionType = CardActionType.CHECKBOX;
        validator.actionTypeSelected = true;

        const mainCta = config.ui.token.validatorCTA.mainCta;
        mainCta.navigateTo = {
            screen: 'DelegateScreen',
            params: {
                accountIndex: this.props.accountIndex,
                blockchain: this.props.blockchain,
                delegationType: DelegationType.DELEGATE,
                token: this.props.token,
                validators: [validator],
                title: mainCta.title
            }
        };

        Object.values(config.ui.token.validatorCTA.otherCtas).map(cta => {
            cta.navigateTo = {
                screen: 'DelegateScreen',
                params: {
                    accountIndex: this.props.accountIndex,
                    blockchain: this.props.blockchain,
                    delegationType: cta.delegationType,
                    token: this.props.token,
                    validators: [validator],
                    title: cta.title
                }
            };
        });

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
                            secondaryStats: validator.secondaryStats
                        }}
                    />
                </View>

                <View style={styles.bottomContainer}>
                    <CtaGroup
                        mainCta={mainCta}
                        otherCtas={config.ui.token.validatorCTA.otherCtas}
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
