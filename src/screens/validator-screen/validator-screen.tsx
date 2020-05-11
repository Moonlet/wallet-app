import React from 'react';
import { View } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { DelegationCTA } from '../../components/delegation-cta/delegation-cta';
import { IButtonCTA } from '../../core/blockchain/types/token';
import { Text } from '../../library';
import { Amount } from '../../components/amount/amount';
import { Blockchain } from '../../core/blockchain/types';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { normalize, BASE_DIMENSION } from '../../styles/dimensions';
import { themes } from '../../navigation/navigation';
import { SmartImage } from '../../library/image/smart-image';

export interface INavigationParams {
    icon: string;
    labelName: string;
    website: string;
}

const navigationOptions = ({ navigation, theme }: any) => ({
    headerTitle: (
        <View style={{ flexDirection: 'row' }}>
            <SmartImage
                source={{ uri: navigation.state.params.icon }}
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
                    {navigation.state.params.labelName}
                </Text>
                <Text
                    style={{
                        fontSize: normalize(11),
                        lineHeight: normalize(13),
                        color: themes[theme].colors.textSecondary,
                        textAlign: 'center'
                    }}
                >
                    {navigation.state.params.website}
                </Text>
            </View>
        </View>
    )
});

export class ValidatorScreenComponent extends React.Component<
    INavigationProps<INavigationParams> & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { styles } = this.props;
        const mainCta: IButtonCTA = {
            title: 'App.labels.vote',
            iconName: 'eye',
            navigateTo: { screen: undefined, params: undefined }
        };

        const otherCta: IButtonCTA[] = [
            {
                title: 'App.labels.revote',
                iconName: 'eye',
                navigateTo: { screen: undefined, params: undefined }
            },
            {
                title: 'App.labels.unvote',
                iconName: 'eye',
                navigateTo: { screen: undefined, params: undefined }
            },
            {
                title: 'App.labels.unlock',
                iconName: 'eye',
                navigateTo: { screen: undefined, params: undefined }
            }
        ];

        const textTop = `Total Votes (11th)`;
        const amount = '2790000000000000000000000';
        const blockchain = Blockchain.CELO;
        const tokenSymbol = 'cGLD';

        return (
            <View style={styles.container}>
                <View style={styles.topContainer}>
                    <Text style={styles.topText}>{textTop}</Text>
                    <Amount
                        style={styles.title}
                        amount={amount}
                        token={tokenSymbol}
                        tokenDecimals={getTokenConfig(blockchain, tokenSymbol).decimals}
                        blockchain={blockchain}
                    />
                    <Amount
                        style={styles.subTitle}
                        amount={amount}
                        token={tokenSymbol}
                        tokenDecimals={getTokenConfig(blockchain, tokenSymbol).decimals}
                        blockchain={blockchain}
                        convert
                    />
                </View>
                <View style={{ flex: 1 }}></View>

                <View style={styles.bottomContainer}>
                    <DelegationCTA mainCta={mainCta} otherCta={otherCta} />
                </View>
            </View>
        );
    }
}

export const ValidatorScreen = smartConnect(ValidatorScreenComponent, [withTheme(stylesProvider)]);
