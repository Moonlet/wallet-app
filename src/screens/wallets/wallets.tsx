import React from 'react';
import { View, TouchableOpacity, ScrollView, Image } from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
    NavigationActions
} from 'react-navigation';
import { IReduxState } from '../../redux/state';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { TabSelect, Text, Button } from '../../library';
import { WalletType } from '../../core/wallet/types';
import { IWalletState } from '../../redux/wallets/state';
import Icon from '../../components/icon';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';

import { translate } from '../../core/i18n';
import { appSwitchWallet } from '../../redux/app/actions';
import { PasswordModal } from '../../components/password-modal/password-modal';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import stylesProvider from './styles';
import { deleteWallet, updateWalletName } from '../../redux/wallets/actions';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { ListCard } from '../../components/list-card/list-card';
import { AlertModal } from '../../components/alert-modal/alert-modal';

export interface IReduxProps {
    wallets: {
        [WalletType.HD]: IWalletState[];
        [WalletType.HW]: IWalletState[];
    };
    currentWalletId: string;
    appSwitchWallet: typeof appSwitchWallet;
    deleteWallet: typeof deleteWallet;
    walletsNr: number;
    updateWalletName: typeof updateWalletName;
}

interface IState {
    selectedTab: WalletType;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        wallets: {
            // TODO reselect? https://github.com/reduxjs/reselect
            [WalletType.HD]: Object.values(state.wallets).filter(
                (wallet: IWalletState) => wallet.type === WalletType.HD
            ),
            [WalletType.HW]: Object.values(state.wallets).filter(
                (wallet: IWalletState) => wallet.type === WalletType.HW
            )
        },
        walletsNr: Object.keys(state.wallets).length,
        currentWalletId: state.app.currentWalletId
    };
};

const mapDispatchToProps = {
    appSwitchWallet,
    deleteWallet,
    updateWalletName
};

const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate('Wallets.manageWallets')
});

export class WalletsScreenComponent extends React.Component<
    INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>> & IReduxProps,
    IState
> {
    public static navigationOptions = navigationOptions;
    public passwordModal = null;
    public alertModal: any = null;

    public walletSwipeableRef: ReadonlyArray<string> = new Array();
    public currentlyOpenSwipeable: string = null;

    constructor(
        props: INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>> & IReduxProps
    ) {
        super(props);

        this.state = {
            selectedTab: WalletType.HD
        };
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.walletsNr !== prevProps.walletsNr && this.props.walletsNr < 1) {
            // maybe check this in another screen?
            this.props.navigation.navigate('OnboardingScreen');
        }
    }

    public onPressRecover() {
        this.props.navigation.navigate(
            'CreateWalletNavigation',
            {},
            NavigationActions.navigate({
                routeName: 'RecoverWallet',
                params: {
                    goBack: (
                        navigation: NavigationScreenProp<NavigationState, NavigationParams>
                    ) => {
                        navigation.navigate('Wallets');
                    }
                }
            })
        );
    }

    public onPressCreateHW() {
        this.props.navigation.navigate(
            'CreateWalletNavigation',
            {},
            NavigationActions.navigate({
                routeName: 'ConnectHardwareWallet',
                params: {
                    goBack: (
                        navigation: NavigationScreenProp<NavigationState, NavigationParams>
                    ) => {
                        navigation.navigate('Wallets');
                    }
                }
            })
        );
    }

    public onPressCreate() {
        this.props.navigation.navigate(
            'CreateWalletNavigation',
            {},
            NavigationActions.navigate({
                routeName: 'CreateWalletMnemonic',
                params: {
                    goBack: (
                        navigation: NavigationScreenProp<NavigationState, NavigationParams>
                    ) => {
                        navigation.navigate('Wallets');
                    }
                }
            })
        );
    }

    public onPressDelete(wallet: IWalletState) {
        // show a confirm dialog

        // this.alertModal
        //     .showConfirm(translate('Wallets.deleteWallet'), translate('Wallets.confirmDelete'))
        //     .then((res: boolean) => {
        //         if (res) {
        //             this.closeCurrentOpenedSwipable();
        //             this.onDeleteConfirmed(wallet);
        //         }
        //     });

        /// OR ///

        this.alertModal.showAlert(
            translate('Wallets.deleteWallet'),
            translate('Wallets.confirmDelete'),
            { text: translate('App.labels.cancel') },
            {
                text: translate('App.labels.delete'),
                onPress: () => {
                    this.closeCurrentOpenedSwipable();
                    this.onDeleteConfirmed(wallet);
                }
            }
        );
    }

    public onDeleteConfirmed(wallet: IWalletState) {
        this.passwordModal.requestPassword().then(() => {
            this.props.deleteWallet(wallet.id);
        });
    }

    public onPressUnveil(wallet: any) {
        this.props.navigation.navigate('ViewWalletMnemonic', { wallet });
    }

    public onPressEdit(wallet: any) {
        this.alertModal
            .showPrompt(
                translate('Wallets.editTitle'),
                translate('Wallets.editDescription'),
                translate('App.labels.cancel'),
                translate('App.labels.save')
            )
            .then(inputValue => {
                if (inputValue !== '') {
                    this.props.updateWalletName(wallet.id, inputValue);
                }
            });
    }

    public onSelectWallet(walletId: string) {
        this.props.appSwitchWallet(walletId);
        this.props.navigation.goBack(null);
    }

    public renderLeftActions = wallet => {
        const styles = this.props.styles;
        return (
            <View style={styles.leftActionsContainer}>
                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        this.onPressDelete(wallet);
                    }}
                >
                    <Icon name="bin" size={32} style={styles.iconActionNegative} />
                    <Text style={styles.textActionNegative}>
                        {translate('Wallets.deleteWallet')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.closeCurrentOpenedSwipable();
                        this.onPressUnveil(wallet);
                    }}
                    style={styles.action}
                >
                    <Icon name="view-1" size={32} style={styles.iconActionPositive} />
                    <Text style={styles.textActionPositive}>{translate('Wallets.unveil')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        this.closeCurrentOpenedSwipable();
                        this.onPressEdit(wallet);
                    }}
                >
                    <Icon name="pencil" size={28} style={styles.iconActionPositive} />
                    <Text style={styles.textActionPositive}>{translate('Wallets.editName')}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    public closeCurrentOpenedSwipable() {
        this.walletSwipeableRef[this.currentlyOpenSwipeable] &&
            this.walletSwipeableRef[this.currentlyOpenSwipeable].close();
    }

    public onSwipeableWillOpen(index: string) {
        if (
            index !== this.currentlyOpenSwipeable &&
            this.walletSwipeableRef[this.currentlyOpenSwipeable]
        ) {
            this.closeCurrentOpenedSwipable();
        }

        this.currentlyOpenSwipeable = index;
    }

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <TabSelect
                    options={{
                        [WalletType.HD]: { title: 'Moonlet' },
                        [WalletType.HW]: { title: 'Ledger' }
                    }}
                    onSelectionChange={key => this.setState({ selectedTab: key })}
                    selected={this.state.selectedTab}
                />
                <ScrollView contentContainerStyle={styles.walletList}>
                    {this.props.wallets[this.state.selectedTab].length === 0 &&
                    this.state.selectedTab === WalletType.HW ? (
                        <View style={styles.emptyWalletsContainer}>
                            <Image
                                style={styles.logoImage}
                                source={require('../../assets/images/png/moonlet_space_gray.png')}
                            />
                            <Text style={styles.connectLedger}>
                                {translate('Wallets.connectLedger')}
                            </Text>
                            <Text style={styles.quicklyConnectLedger}>
                                {translate('Wallets.quicklyConnectLedger')}
                            </Text>
                        </View>
                    ) : (
                        this.props.wallets[this.state.selectedTab].map(wallet => {
                            const index = wallet.id;

                            return (
                                <Swipeable
                                    key={index}
                                    ref={ref => (this.walletSwipeableRef[index] = ref)}
                                    renderLeftActions={() => this.renderLeftActions(wallet)}
                                    onSwipeableWillOpen={() => this.onSwipeableWillOpen(index)}
                                >
                                    <ListCard
                                        onPress={() => this.onSelectWallet(wallet.id)}
                                        leftIcon="saturn-icon"
                                        label={wallet.name}
                                        rightIcon={
                                            this.props.currentWalletId === wallet.id && 'check-1'
                                        }
                                        selected={this.props.currentWalletId === wallet.id}
                                    />
                                </Swipeable>
                            );
                        })
                    )}
                </ScrollView>
                <View style={styles.bottomContainer}>
                    {
                        {
                            [WalletType.HD]: (
                                <View style={styles.buttonContainer}>
                                    <Button
                                        style={styles.bottomButton}
                                        onPress={() => {
                                            this.onPressCreate();
                                        }}
                                    >
                                        {translate('App.labels.create')}
                                    </Button>
                                    <Button
                                        style={styles.bottomButton}
                                        onPress={() => {
                                            this.onPressRecover();
                                        }}
                                    >
                                        {translate('App.labels.recover')}
                                    </Button>
                                </View>
                            ),
                            [WalletType.HW]: (
                                <View style={styles.buttonContainer}>
                                    <Button
                                        style={styles.bottomButton}
                                        onPress={() => {
                                            this.onPressCreateHW();
                                        }}
                                    >
                                        {translate('App.labels.startConnect')}
                                    </Button>
                                </View>
                            )
                        }[this.state.selectedTab]
                    }
                </View>

                <PasswordModal
                    subtitle={translate('Password.subtitleDeleteWallet')}
                    obRef={ref => (this.passwordModal = ref)}
                />

                <AlertModal obRef={ref => (this.alertModal = ref)} />
            </View>
        );
    }
}

export const WalletsScreen = smartConnect(WalletsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
