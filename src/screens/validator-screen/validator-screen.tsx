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
import { normalize, BASE_DIMENSION } from '../../styles/dimensions';
import { SmartImage } from '../../library/image/smart-image';
import { IValidatorCard } from '../../core/blockchain/types/stats';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { themes } from '../../navigation/navigation';

export interface INavigationParams {
    validator: IValidatorCard;
    blockchain: Blockchain;
}

const navigationOptions = ({ navigation, theme }: any) => ({
    headerTitle: (
        <View style={{ flexDirection: 'row' }}>
            <SmartImage
                source={{ uri: navigation.state.params.validator.icon }}
                style={{
                    height: normalize(36),
                    width: normalize(36),
                    borderRadius: normalize(36),
                    marginRight: BASE_DIMENSION * 2,
                    alignSelf: 'center'
                }}
            />
            <View style={{ flexDirection: 'column' }}>
                <Text
                    style={{
                        fontSize: normalize(22),
                        lineHeight: normalize(28),
                        fontWeight: 'bold',
                        letterSpacing: 0.35,
                        color: '#FFFFFF',
                        textAlign: 'center'
                    }}
                >
                    {navigation.state.params.validator.labelName}
                </Text>
                <Text
                    style={{
                        fontSize: normalize(11),
                        lineHeight: normalize(13),
                        color: themes[theme].colors.textSecondary,
                        textAlign: 'center'
                    }}
                >
                    {navigation.state.params.validator.website}
                </Text>
            </View>
        </View>
    )
});

export class ValidatorScreenComponent extends React.Component<
    INavigationParams &
        INavigationProps<INavigationParams> &
        IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { styles } = this.props;
        const config = getBlockchain(this.props.blockchain).config;

        const textTop = `Total Votes (11th)`;
        const amount = '2790000000000000000000000';
        const blockchain = Blockchain.CELO;
        const token = getTokenConfig(blockchain, config.coin);

        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.topText}>{textTop}</Text>
                    <Amount
                        style={styles.title}
                        amount={amount}
                        token={token.symbol}
                        tokenDecimals={getTokenConfig(this.props.blockchain, token.symbol).decimals}
                        blockchain={blockchain}
                    />
                    <Amount
                        style={styles.subTitle}
                        amount={amount}
                        token={token.symbol}
                        tokenDecimals={getTokenConfig(blockchain, token.symbol).decimals}
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
