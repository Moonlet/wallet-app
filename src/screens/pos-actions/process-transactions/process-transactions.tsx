import React from 'react';
import { View } from 'react-native';
import { Text, Button } from '../../../library';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { smartConnect } from '../../../core/utils/smart-connect';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import { translate } from '../../../core/i18n';
import Icon from '../../../components/icon/icon';
import { IconValues } from '../../../components/icon/values';
import { normalize } from '../../../styles/dimensions';
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator';

const navigationOptions = () => ({ title: 'Processing' });

export class ProcessingScreenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    private renderCard(topText: string, middleText: string, bottomText: string, status: string) {
        const { styles, theme } = this.props;

        return (
            <View style={styles.cardContainer}>
                <Icon
                    name={status === 'success' ? IconValues.VOTE : IconValues.PENDING}
                    size={normalize(30)}
                    style={[
                        styles.cardLeftIcon,
                        { color: status === 'success' ? theme.colors.accent : theme.colors.warning }
                    ]}
                />

                <View style={styles.cardTextContainer}>
                    <Text style={styles.topText}>{topText}</Text>
                    <Text style={styles.middleText}>{middleText}</Text>
                    <Text style={styles.bottomText}>{bottomText}</Text>
                </View>

                {status === 'pending' && (
                    <View>
                        <LoadingIndicator />
                    </View>
                )}
                {status === 'failed' && (
                    <Text style={styles.failedText}>{translate('App.labels.failed')}</Text>
                )}
                {status === 'success' && (
                    <Icon name={IconValues.CHECK} size={normalize(16)} style={styles.successIcon} />
                )}
            </View>
        );
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <Text style={styles.title}>
                    {`Please wait while each transaction is being processed!`}
                </Text>
                {/* TODO */}
                {/* 'Please sign each transaction from your Ledger and wait while is being processed!'  */}
                <View style={styles.content}>
                    {this.renderCard('37,500.00 ZIL', 'to Moonlet', 'Fees: 10.00 ZIL', 'pending')}
                    {this.renderCard('37,500.00 ZIL', 'to Moonlet', 'Fees: 10.00 ZIL', 'failed')}
                    {this.renderCard('37,500.00 ZIL', 'to Moonlet', 'Fees: 10.00 ZIL', 'failed')}
                    {this.renderCard('37,500.00 ZIL', 'to Moonlet', 'Fees: 10.00 ZIL', 'success')}
                </View>
                <Button
                    primary
                    onPress={() => {
                        //
                    }}
                    wrapperStyle={styles.continueButton}
                    // disabled={true}
                >
                    {translate('App.labels.continue')}
                </Button>
            </View>
        );
    }
}

export const ProcessingScreen = smartConnect(ProcessingScreenComponent, [
    withTheme(stylesProvider)
]);
