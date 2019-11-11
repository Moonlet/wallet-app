import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { HeaderRight } from '../../components/header-right/header-right';
import stylesProvider from './styles';
import { IAccountState } from '../../redux/wallets/state';
import { IReduxState } from '../../redux/state';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { withTheme } from '../../core/theme/with-theme';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text, Button } from '../../library';
import { translate, Translate } from '../../core/i18n';
import { Icon } from '../../components/icon';
import { AccountSettings } from './components/account-settings/account-settings';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export interface IReduxProps {
    account: IAccountState;
}
interface IState {
    settingsVisible: boolean;
}
const navigationOptions = ({ navigation }: any) => ({
    headerRight: () => {
        return (
            <HeaderRight
                icon="navigation-menu-vertical"
                onPress={
                    navigation.state.params ? navigation.state.params.openSettingsMenu : undefined
                }
            />
        );
    }
});

export class AccountScreenComponent extends React.Component<IReduxProps & IProps, IState> {
    public static navigationOptions = navigationOptions;

    constructor(props: IReduxProps & IProps) {
        super(props);

        this.state = {
            settingsVisible: false
        };
    }
    public componentDidMount() {
        this.props.navigation.setParams({
            openSettingsMenu: this.openSettingsMenu
        });
    }

    public openSettingsMenu = () => {
        this.setState({ settingsVisible: !this.state.settingsVisible });
    };

    public render() {
        const { styles, navigation } = this.props;
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.address}>zil1f6...1234f3</Text>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balance} format={{ currency: 'ZIL' }}>
                        10900
                    </Text>
                    <Text style={styles.balanceSymbolFiat} format={{ currency: 'USD' }}>
                        88.18
                    </Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <Button
                        testID="button-send"
                        style={styles.button}
                        onPress={() => {
                            navigation.navigate('Send');
                        }}
                    >
                        {translate('App.labels.send')}
                    </Button>
                    <Button
                        testID="button-receive"
                        style={styles.button}
                        onPress={() => {
                            navigation.navigate('Receive', { address: 'value' });
                        }}
                    >
                        {translate('App.labels.receive')}
                    </Button>
                </View>

                <View style={styles.transactionsContainer}>
                    <Translate text="App.labels.transactions" style={styles.transactionsTitle} />

                    <View>
                        {['', '', ''].map(tx => (
                            <TouchableOpacity
                                key={Math.random()}
                                style={styles.transactionListItem}
                            >
                                <Icon
                                    name="money-wallet-1"
                                    size={24}
                                    style={styles.transactionIcon}
                                />
                                <View style={styles.transactionTextContainer}>
                                    <Text style={styles.transactionTextPrimary}>
                                        100 ZIL to Account1
                                    </Text>
                                    <Text style={styles.transactionTextSecondary}>
                                        26/06/2019, 23:22:55
                                    </Text>
                                </View>
                                <Icon
                                    name="arrow-right-1"
                                    size={16}
                                    style={styles.transactionRightIcon}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                {this.state.settingsVisible ? (
                    // onDonePressed={this.openSettingsMenu}
                    <AccountSettings />
                ) : null}
            </ScrollView>
        );
    }
}

export const mapStateToProps = (state: IReduxState, ownProps: IProps): IReduxProps & IProps => {
    const account = {} as any;

    return {
        ...ownProps,
        account
    };
};

export const AccountScreen = smartConnect(AccountScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
