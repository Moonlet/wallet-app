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

export class ValidatorScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
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
