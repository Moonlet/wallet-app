import React from 'react';
import { View, TouchableOpacity, ScrollView, Alert } from 'react-native';
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

import { translate } from '../../core/i18n';
import { appSwitchWallet } from '../../redux/app/actions';
import { PasswordModal } from '../../components/password-modal/password-modal';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import stylesProvider from './styles';
import { deleteWallet } from '../../redux/wallets/actions';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { ListCard } from '../../components/list-card/list-card';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export interface IReduxProps {
    wallets: {
        [WalletType.HD]: IWalletState[];
        [WalletType.HW_LEDGER]: IWalletState[];
    };
    currentWalletId: string;
    appSwitchWallet: typeof appSwitchWallet;
    deleteWallet: typeof deleteWallet;
    walletsNr: number;
}

interface IState {
    selectedTab: WalletType;
    openedSwipeIndex: number;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        wallets: {
            // TODO reselect? https://github.com/reduxjs/reselect
            [WalletType.HD]: state.wallets.filter(wallet => wallet.type === WalletType.HD),
            [WalletType.HW_LEDGER]: state.wallets.filter(
                wallet => wallet.type === WalletType.HW_LEDGER
            )
        },
        walletsNr: state.wallets.length,
        currentWalletId: state.app.currentWalletId
    };
};

const mapDispatchToProps = {
    appSwitchWallet,
    deleteWallet
};

const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: translate('App.labels.wallets')
});

export class WalletsScreenComponent extends React.Component<
    IProps & IThemeProps<ReturnType<typeof stylesProvider>> & IReduxProps,
    IState
> {
    public static navigationOptions = navigationOptions;
    public passwordModal = null;
    public passwordModalRef: any;
    // public walletSwipableRef: RefObject<typeof Swipeable>[] = new Array();
    public walletSwipableRef: any[] = new Array();

    constructor(props) {
        super(props);

        this.state = {
            selectedTab: WalletType.HD,
            openedSwipeIndex: -1
        };
    }

    public componentDidUpdate(props) {
        if (props.walletsNr < 1) {
            // maybe check this in another screen?
            props.navigation.navigate('OnboardingScreen');
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
        Alert.alert(translate('Wallets.deleteWallet'), translate('Wallets.confirmDelete'), [
            {
                text: translate('App.labels.cancel'),
                onPress: () => {
                    /* console.log('Cancel Pressed')*/
                },
                style: 'cancel'
            },
            {
                text: translate('App.labels.delete'),
                onPress: () => {
                    this.closeCurrentOpenedSwipable();
                    this.onDeleteConfirmed(wallet);
                }
            }
        ]);
    }

    public onDeleteConfirmed(wallet: IWalletState) {
        this.passwordModalRef.requestPassword().then(
            () => {
                this.props.deleteWallet(wallet.id);
            },
            () => {
                // @ts-ignore
            }
        );
    }

    public onPressUnveil(wallet: any) {
        this.props.navigation.navigate('ViewWalletMnemonic', { wallet });
    }

    public onPressEdit(wallet: any) {
        throw new Error('Method not implemented.');
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
                <TouchableOpacity style={styles.action}>
                    <Icon
                        name="view-1"
                        size={32}
                        style={styles.iconActionPositive}
                        onPress={() => {
                            this.closeCurrentOpenedSwipable();
                            this.onPressUnveil(wallet);
                        }}
                    />
                    <Text style={styles.textActionPositive}>{translate('Wallets.unveil')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
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
        this.walletSwipableRef[this.state.openedSwipeIndex] &&
            this.walletSwipableRef[this.state.openedSwipeIndex].close();
    }

    public render() {
        const styles = this.props.styles;

        return (
            <View style={styles.container}>
                <TabSelect
                    options={{
                        [WalletType.HD]: { title: 'Moonlet' },
                        [WalletType.HW_LEDGER]: { title: 'Ledger' }
                    }}
                    onSelectionChange={key => {
                        this.setState({
                            selectedTab: key
                        });
                    }}
                    selected={this.state.selectedTab}
                />
                <ScrollView style={styles.walletList}>
                    {this.props.wallets[this.state.selectedTab].map((wallet, i) => {
                        return (
                            <Swipeable
                                ref={ref => {
                                    this.walletSwipableRef[i] = ref;
                                }}
                                renderLeftActions={() => this.renderLeftActions(wallet)}
                                onSwipeableWillOpen={() => {
                                    if (
                                        i !== this.state.openedSwipeIndex &&
                                        this.walletSwipableRef[this.state.openedSwipeIndex]
                                    ) {
                                        this.walletSwipableRef[this.state.openedSwipeIndex].close();
                                    }
                                    this.setState({
                                        openedSwipeIndex: i
                                    });
                                }}
                                key={i}
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
                    })}
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
                            [WalletType.HW_LEDGER]: (
                                <View style={styles.buttonContainer}>
                                    <Button style={styles.bottomButton}>
                                        {translate('App.labels.connect')}
                                    </Button>
                                </View>
                            )
                        }[this.state.selectedTab]
                    }
                </View>

                <PasswordModal
                    buttonLabel={translate('Wallets.deleteWallet')}
                    infoText={translate('Wallets.deletePasswordRequest')}
                    visible={false}
                    obRef={ref => (this.passwordModalRef = ref)}
                />
            </View>
        );
    }
}

export const WalletsScreen = smartConnect(WalletsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
