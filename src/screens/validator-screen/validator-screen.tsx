import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { DelegationCTA } from '../../components/delegation-cta/delegation-cta';
import { Text } from '../../library';
import { Amount } from '../../components/amount/amount';
import { Blockchain } from '../../core/blockchain/types';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { INavigationProps, withNavigationParams } from '../../navigation/with-navigation-params';
import { SmartImage } from '../../library/image/smart-image';
import { IValidatorCard } from '../../core/blockchain/types/stats';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';

export interface INavigationParams {
    validator: IValidatorCard;
    blockchain: Blockchain;
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
                    {props.navigation.state.params.validator.labelName}
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

        const textTop = `${validator.totalLabel} (${validator.rank})`;
        const amount = validator.totalAmountStd;
        const token = getTokenConfig(blockchain, config.coin);

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
                <View style={{ flex: 1 }}></View>

                <View style={styles.bottomContainer}>
                    <DelegationCTA
                        mainCta={config.ui.token.validatorCTA.mainCta}
                        otherCta={config.ui.token.validatorCTA.otherCta}
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
