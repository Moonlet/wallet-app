import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { translate } from '../../core/i18n';
import { SmartScreen } from '../smart-screen/smart-screen';
import { ContextScreen } from '../../components/widgets/types';

const navigationOptions = () => ({ title: translate('App.labels.quickStake') });

class QuickStakeSelectValidatorScreenComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <SmartScreen
                    context={{
                        screen: ContextScreen.QUICK_STAKE_SELECT_VALIDATOR
                    }}
                />
            </View>
        );
    }
}

export const QuickStakeSelectValidatorScreen = smartConnect(
    QuickStakeSelectValidatorScreenComponent,
    [withTheme(stylesProvider)]
);
