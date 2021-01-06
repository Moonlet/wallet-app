import React from 'react';
import { View, Switch } from 'react-native';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { translate } from '../../core/i18n';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { toggleCumulativeBalance } from '../../redux/preferences/actions';
import { IReduxState } from '../../redux/state';
import { Text } from '../../library';

interface IReduxProps {
    cumulativeBalance: boolean;
    toggleCumulativeBalance: typeof toggleCumulativeBalance;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        cumulativeBalance: state.preferences.cumulativeBalance
    };
};

const mapDispatchToProps = {
    toggleCumulativeBalance
};

const navigationOptions = () => ({
    title: translate('App.labels.totalBalance')
});

class TotalBalanceComponent extends React.Component<
    IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public render() {
        const { cumulativeBalance, styles, theme } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.rowContainer}>
                    <Text style={styles.cumulativeText}>{translate('App.labels.cumulative')}</Text>
                    <View style={styles.switch}>
                        <Switch
                            onValueChange={() => this.props.toggleCumulativeBalance()}
                            value={cumulativeBalance}
                            trackColor={{
                                true: this.props.theme.colors.cardBackground,
                                false: this.props.theme.colors.cardBackground
                            }}
                            thumbColor={
                                cumulativeBalance
                                    ? theme.colors.accent
                                    : theme.colors.inputBackground
                            }
                        />
                    </View>
                </View>

                <Text style={styles.cumulativeTextInfo}>
                    {translate('TotalBalance.byCumulativeMessage')}
                </Text>
            </View>
        );
    }
}

export const TotalBalanceScreen = smartConnect(TotalBalanceComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
