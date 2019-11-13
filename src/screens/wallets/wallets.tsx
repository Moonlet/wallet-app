import React from 'react';
import { View, TouchableOpacity, ScrollView, TouchableHighlight } from 'react-native';
import {
    NavigationParams,
    NavigationScreenProp,
    NavigationState,
    NavigationActions
} from 'react-navigation';
import { IReduxState } from '../../redux/state';
import { withTheme } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { HeaderLeft } from '../../components/header-left/header-left';
import { TabSelect, Text, Swipeable, Button } from '../../library';
import { WalletType } from '../../core/wallet/types';
import { IWalletState } from '../../redux/wallets/state';
import Icon from '../../components/icon';

import { ITheme } from '../../core/theme/itheme';
import stylesProvider from './styles';
import { translate } from '../../core/i18n';
import { appSwitchWallet } from '../../redux/app/actions';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IReduxProps {
    wallets: {
        [WalletType.HD]: IWalletState[];
        [WalletType.HW_LEDGER]: IWalletState[];
    };
    idToIndex: any;
    currentWalletId: string;
    appSwitchWallet: typeof appSwitchWallet;
}

interface IState {
    selectedTab: WalletType;
}

export const mapStateToProps = (state: IReduxState) => {
    return {
        wallets: {
            // TODO reselect? https://github.com/reduxjs/reselect
            [WalletType.HD]: state.wallets.filter(wallet => wallet.type === WalletType.HD),
            [WalletType.HW_LEDGER]: state.wallets.filter(
                wallet => wallet.type === WalletType.HW_LEDGER
            )
        },
        idToIndex: state.wallets.reduce((out, wallet, i) => {
            out[wallet.id] = i;
            return out;
        }, {}),
        currentWalletId: state.wallets[state.app.currentWalletIndex].id
    };
};

const mapDispatchToProps = {
    appSwitchWallet
};

export const navigationOptions = ({ navigation }: any) => ({
    headerLeft: () => {
        return (
            <HeaderLeft
                icon="close"
                text="Close"
                onPress={() => {
                    navigation.goBack();
                }}
            />
        );
    },
    title: 'Wallets'
});

export class WalletsScreenComponent extends React.Component<IProps & IReduxProps, IState> {
    public static navigationOptions = navigationOptions;
    constructor(props) {
        super(props);

        this.state = {
            selectedTab: WalletType.HD
        };
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

    public onSelectWallet(walletId: string) {
        this.props.appSwitchWallet(this.props.idToIndex[walletId]);
        this.props.navigation.goBack(null);
    }

    public renderLeftActions = () => {
        const styles = this.props.styles;
        return (
            <View style={styles.leftActionsContainer}>
                <TouchableOpacity style={styles.action}>
                    <Icon name="bin" size={32} style={styles.iconActionNegative} />
                    <Text style={styles.textActionNegative}>
                        {translate('Wallets.deleteWallet')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.action}>
                    <Icon name="view-1" size={32} style={styles.iconActionPositive} />
                    <Text style={styles.textActionPositive}>{translate('Wallets.unveil')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.action}>
                    <Icon name="pencil" size={28} style={styles.iconActionPositive} />
                    <Text style={styles.textActionPositive}>{translate('Wallets.editName')}</Text>
                </TouchableOpacity>
            </View>
        );
    };

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
                            <Swipeable renderLeftActions={this.renderLeftActions} key={i}>
                                <TouchableHighlight onPress={() => this.onSelectWallet(wallet.id)}>
                                    <View
                                        style={[
                                            styles.walletCard,
                                            this.props.currentWalletId === wallet.id &&
                                                styles.selectedWallet
                                        ]}
                                    >
                                        <Icon
                                            name="saturn-icon"
                                            size={24}
                                            style={styles.iconWallet}
                                        />
                                        <Text style={{ flex: 1 }}>Wallet {i + 1}</Text>
                                        {this.props.currentWalletId === wallet.id && (
                                            <Icon
                                                name="check-1"
                                                size={18}
                                                style={styles.iconWallet}
                                            />
                                        )}
                                    </View>
                                </TouchableHighlight>
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
            </View>
        );
    }
}

export const WalletsScreen = smartConnect(WalletsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
