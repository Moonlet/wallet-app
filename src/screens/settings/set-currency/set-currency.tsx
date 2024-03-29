import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { INavigationProps } from '../../../navigation/with-navigation-params';
import { Text } from '../../../library';
import { IReduxState } from '../../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Icon } from '../../../components/icon/icon';
import { smartConnect } from '../../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../../core/i18n';
import { AVAILABLE_CURRENCIES } from '../../../core/constants/app';
import { setCurrency } from '../../../redux/preferences/actions';
import { normalize } from '../../../styles/dimensions';
import { IconValues } from '../../../components/icon/values';

interface IReduxProps {
    selectedCurrency: string;
    setCurrency: typeof setCurrency;
}

const mapDispatchToProps = {
    setCurrency
};

const mapStateToProps = (state: IReduxState) => ({
    selectedCurrency: state.preferences.currency
});

const navigationOptions = () => ({
    title: translate('Settings.defaultCurrency')
});

class SetCurrencyComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { styles } = this.props;

        return (
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {Object.values(AVAILABLE_CURRENCIES).map((currency: string, index: number) => (
                    <View key={index}>
                        <TouchableOpacity
                            testID={currency}
                            style={styles.rowContainer}
                            onPress={() => this.props.setCurrency(currency)}
                        >
                            <Text style={styles.textRow}>{currency}</Text>
                            {this.props.selectedCurrency === currency && (
                                <Icon
                                    name={IconValues.CHECK}
                                    size={normalize(16)}
                                    style={styles.icon}
                                />
                            )}
                        </TouchableOpacity>
                        <View style={styles.divider} />
                    </View>
                ))}
            </ScrollView>
        );
    }
}

export const SetCurrencyScreen = smartConnect(SetCurrencyComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
