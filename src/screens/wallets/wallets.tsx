import React from 'react';
import { View, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { StackActions } from 'react-navigation';
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
import { PasswordModal } from '../../components/password-modal/password-modal';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import stylesProvider from './styles';
import { deleteWallet, updateWalletName, setSelectedWallet } from '../../redux/wallets/actions';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { ListCard } from '../../components/list-card/list-card';
import { Dialog } from '../../components/dialog/dialog';
import { getSelectedWallet } from '../../redux/wallets/selectors';
import { normalize } from '../../styles/dimensions';
import { updateDisplayedHint } from '../../redux/app/actions';
import { HintsScreen, HintsComponent, IHints } from '../../redux/app/state';
import { DISPLAY_HINTS_TIMES } from '../../core/constants/app';

export interface IReduxProps {
    wallets: {
        [WalletType.HD]: IWalletState[];
        [WalletType.HW]: IWalletState[];
    };
    selectedWallet: IWalletState;
    setSelectedWallet: typeof setSelectedWallet;
    deleteWallet: typeof deleteWallet;
    walletsNr: number;
    updateWalletName: typeof updateWalletName;
    hints: IHints;
    updateDisplayedHint: typeof updateDisplayedHint;
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
        selectedWallet: getSelectedWallet(state),
        hints: state.app.hints
    };
};

const mapDispatchToProps = {
    setSelectedWallet,
    deleteWallet,
    updateWalletName,
    updateDisplayedHint
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

    public walletSwipeableRef: ReadonlyArray<string> = [];
    public currentlyOpenSwipeable: string = null;

    constructor(
        props: INavigationProps & IThemeProps<ReturnType<typeof stylesProvider>> & IReduxProps
    ) {
        super(props);

        this.state = {
            selectedTab: props.selectedWallet.type
        };
    }

    public componentDidMount() {
        setTimeout(() => this.showHints(), 500);
    }

    private showHints() {
        if (
            this.props.wallets &&
            this.props.wallets[this.state.selectedTab].length !== 0 &&
            this.props.hints.WALLETS_SCREEN.WALLETS_LIST < DISPLAY_HINTS_TIMES
        ) {
            const id = this.props.wallets[this.state.selectedTab][0].id;

            this.onSwipeableWillOpen(id);
            this.walletSwipeableRef[id] && this.walletSwipeableRef[id].openLeft();
            this.props.updateDisplayedHint(HintsScreen.WALLETS_SCREEN, HintsComponent.WALLETS_LIST);

            setTimeout(() => this.closeCurrentOpenedSwipable(), 1000);
        }
    }

    public componentDidUpdate(prevProps: IReduxProps) {
        if (this.props.walletsNr !== prevProps.walletsNr && this.props.walletsNr < 1) {
            // maybe check this in another screen?
            this.props.navigation.dispatch(StackActions.popToTop());
            this.props.navigation.navigate('OnboardingNavigation');
        }
    }

    public onPressRecover() {
        this.props.navigation.navigate('RecoverWallet');
    }

    public onPressCreateHW() {
        this.props.navigation.navigate('ConnectHardwareWallet');
    }

    public onPressCreate() {
        this.props.navigation.navigate('CreateWalletMnemonic', {
            mnemonic: undefined,
            step: 1
        });
    }

    public async onPressDelete(wallet: IWalletState) {
        if (
            await Dialog.confirm(
                translate('Wallets.deleteWallet'),
                translate('Wallets.confirmDelete')
            )
        ) {
            this.closeCurrentOpenedSwipable();
            this.onDeleteConfirmed(wallet);
        }
    }

    public async onDeleteConfirmed(wallet: IWalletState) {
        try {
            await PasswordModal.getPassword(
                translate('Password.pinTitleUnlock'),
                translate('Password.subtitleDeleteWallet')
            );
            this.props.deleteWallet(wallet.id);
        } catch (err) {
            //
        }
    }
    a;

    public onPressUnveil(wallet: any) {
        this.props.navigation.navigate('ViewWalletMnemonic', { wallet });
    }

    public async onPressEdit(wallet: any) {
        const inputValue: string = await Dialog.prompt(
            translate('Wallets.editTitle'),
            translate('Wallets.editDescription')
        );

        if (inputValue !== '') {
            this.props.updateWalletName(wallet.id, inputValue);
        }
    }

    public onSelectWallet(walletId: string) {
        this.props.setSelectedWallet(walletId);
        this.props.navigation.goBack(null);
    }

    public renderLeftActions(wallet: IWalletState) {
        const styles = this.props.styles;
        return (
            <View style={styles.leftActionsContainer}>
                <TouchableOpacity style={styles.action} onPress={() => this.onPressDelete(wallet)}>
                    <Icon name="bin" size={normalize(32)} style={styles.iconActionNegative} />
                    <Text style={styles.textActionNegative}>
                        {translate('Wallets.deleteWallet')}
                    </Text>
                </TouchableOpacity>
                {wallet.type !== WalletType.HW && (
                    <TouchableOpacity
                        onPress={() => {
                            this.closeCurrentOpenedSwipable();
                            this.onPressUnveil(wallet);
                        }}
                        style={styles.action}
                    >
                        <Icon
                            name="view-1"
                            size={normalize(32)}
                            style={styles.iconActionPositive}
                        />
                        <Text style={styles.textActionPositive}>{translate('Wallets.unveil')}</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.action}
                    onPress={() => {
                        this.closeCurrentOpenedSwipable();
                        this.onPressEdit(wallet);
                    }}
                >
                    <Icon name="pencil" size={normalize(28)} style={styles.iconActionPositive} />
                    <Text style={styles.textActionPositive}>{translate('Wallets.editName')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
        const { selectedTab } = this.state;

        return (
            <View style={styles.container}>
                <TabSelect
                    options={{
                        [WalletType.HD]: { title: 'Moonlet' },
                        [WalletType.HW]: { title: 'Ledger' }
                    }}
                    onSelectionChange={key => this.setState({ selectedTab: key })}
                    selected={selectedTab}
                />
                <View style={styles.scrollContainer}>
                    <ScrollView
                        contentContainerStyle={styles.walletList}
                        showsVerticalScrollIndicator={false}
                    >
                        {this.props.wallets[selectedTab].length === 0 ? (
                            <View style={styles.emptyWalletsContainer}>
                                <Image
                                    style={styles.logoImage}
                                    source={require('../../assets/images/png/moonlet_space_gray.png')}
                                />
                                <Text style={styles.connectLedger}>
                                    {selectedTab === WalletType.HW
                                        ? translate('Wallets.connectLedger')
                                        : translate('Wallets.connectWallet')}
                                </Text>
                                <Text style={styles.quicklyConnectLedger}>
                                    {selectedTab === WalletType.HW
                                        ? translate('Wallets.quicklyConnectLedger')
                                        : translate('Wallets.quicklyConnectWallet')}
                                </Text>
                            </View>
                        ) : (
                            this.props.wallets[selectedTab].map(wallet => {
                                const index = wallet.id;

                                return (
                                    <Swipeable
                                        key={index}
                                        ref={ref => (this.walletSwipeableRef[index] = ref)}
                                        renderLeftActions={() =>
                                            Platform.OS !== 'web' && this.renderLeftActions(wallet)
                                        }
                                        onSwipeableWillOpen={() => this.onSwipeableWillOpen(index)}
                                    >
                                        <ListCard
                                            onPress={() => this.onSelectWallet(wallet.id)}
                                            leftIcon="saturn-icon"
                                            label={wallet.name}
                                            rightIcon={
                                                this.props.selectedWallet.id === wallet.id &&
                                                'check-1'
                                            }
                                            selected={this.props.selectedWallet.id === wallet.id}
                                        />
                                    </Swipeable>
                                );
                            })
                        )}
                    </ScrollView>
                </View>

                <View style={styles.bottomContainer}>
                    {
                        {
                            [WalletType.HD]: Platform.OS !== 'web' && (
                                <View style={styles.buttonContainer}>
                                    <Button
                                        style={styles.bottomButton}
                                        onPress={() => this.onPressCreate()}
                                    >
                                        {translate('App.labels.create')}
                                    </Button>
                                    <Button
                                        style={styles.bottomButton}
                                        onPress={() => this.onPressRecover()}
                                    >
                                        {translate('App.labels.recover')}
                                    </Button>
                                </View>
                            ),
                            [WalletType.HW]: Platform.OS !== 'web' && (
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
                        }[selectedTab]
                    }
                </View>
            </View>
        );
    }
}

export const WalletsScreen = smartConnect(WalletsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
