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
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { AccountAddress } from '../../components/account-address/account-address';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export interface IReduxProps {
    accountx: IAccountState;
}

export interface INavigationParams {
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

export class AccountScreenComponent extends React.Component<
    INavigationProps<INavigationParams> & IReduxProps & IProps,
    IState
> {
    public static navigationOptions = navigationOptions;

    constructor(props: INavigationProps<INavigationParams> & IReduxProps & IProps) {
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
        const { styles, navigation, account } = this.props;
        return (
            <ScrollView style={styles.container}>
                <AccountAddress account={account} />
                <View style={styles.buttonsContainer}>
                    <Button
                        testID="button-send"
                        style={styles.button}
                        onPress={() => {
                            navigation.navigate('Send', { account });
                        }}
                    >
                        {translate('App.labels.send')}
                    </Button>
                    <Button
                        testID="button-receive"
                        style={styles.button}
                        onPress={() => {
                            navigation.navigate('Receive', { account });
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
                    //
                    <AccountSettings
                        onDonePressed={this.openSettingsMenu}
                        account={this.props.account}
                    />
                ) : null}
            </ScrollView>
        );
    }
}

export const mapStateToProps = (state: IReduxState, ownProps: IProps): IReduxProps & IProps => {
    const accountx = {} as any;
    return {
        ...ownProps,
        accountx
    };
};

export const AccountScreen = smartConnect(AccountScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider),
    withNavigationParams()
]);
