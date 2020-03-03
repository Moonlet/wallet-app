import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { HeaderRight } from '../../../../components/header-right/header-right';
import stylesProvider from './styles';
import { IAccountState, IWalletState } from '../../../../redux/wallets/state';
import {
    getAccountFilteredTransactions,
    getAccount,
    getSelectedWallet
} from '../../../../redux/wallets/selectors';
import { IReduxState } from '../../../../redux/state';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { translate } from '../../../../core/i18n';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { Blockchain, IBlockchainTransaction, ChainIdType } from '../../../../core/blockchain/types';
import { ICON_SIZE, BASE_DIMENSION } from '../../../../styles/dimensions';
import { themes } from '../../../../navigation/navigation';
import { PasswordModal } from '../../../../components/password-modal/password-modal';
import { sendTransferTransaction, getBalance } from '../../../../redux/wallets/actions';
import { getChainId } from '../../../../redux/preferences/selectors';
import { ITokenConfig } from '../../../../core/blockchain/types/token';
import FastImage from '../../../../core/utils/fast-image';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import bind from 'bind-decorator';
import { AccountTab } from './components/account-tab/account-tab';
import { DelegationsTab } from './components/delegations-tab/delegations-tab';
import { ValidatorsTab } from './components/validators-tab/validators-tab';
import { TransactionsTab } from './components/transactions-tab/transactions-tab';

export interface IProps {
    accountIndex: number;
    blockchain: Blockchain;
    extensionTransactionPayload: any; // TODO add typing
    token: ITokenConfig;
}

export interface IReduxProps {
    account: IAccountState;
    transactions: IBlockchainTransaction[];
    wallet: IWalletState;
    sendTransferTransaction: typeof sendTransferTransaction;
    chainId: ChainIdType;
    getBalance: typeof getBalance;
}

export interface IState {
    activeTab: string;
}

export const mapStateToProps = (state: IReduxState, ownProps: IProps) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        transactions: getAccountFilteredTransactions(
            state,
            ownProps.accountIndex,
            ownProps.blockchain,
            ownProps.token
        ),
        wallet: getSelectedWallet(state),
        extensionTransactionPayload: ownProps.extensionTransactionPayload,
        chainId: getChainId(state, ownProps.blockchain)
    };
};

const mapDispatchToProps = {
    sendTransferTransaction,
    getBalance
};

const navigationOptions = ({ navigation, theme }: any) => ({
    headerRight: () => (
        <HeaderRight
            icon="navigation-menu-horizontal"
            onPress={navigation.state.params ? navigation.state.params.openSettingsMenu : undefined}
        />
    ),
    headerTitle: () => (
        <View style={{ flexDirection: 'row' }}>
            <FastImage
                style={{ height: ICON_SIZE, width: ICON_SIZE, marginRight: BASE_DIMENSION }}
                resizeMode="contain"
                source={navigation.state.params.tokenLogo}
            />
            <Text
                style={{
                    fontSize: 22,
                    lineHeight: 28,
                    color: themes[theme].colors.text,
                    letterSpacing: 0.38,
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}
            >
                {`${translate('App.labels.account')} ${navigation.state.params.accountIndex + 1}`}
            </Text>
        </View>
    )
});

export class DelegateTokenScreenComponent extends React.Component<
    INavigationProps & IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    public static navigationOptions = navigationOptions;
    public passwordModal: any;

    constructor(
        props: INavigationProps &
            IProps &
            IReduxProps &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        const config = getBlockchain(this.props.blockchain).config;
        this.state = {
            activeTab: config.ui.token.labels.tabAccount
        };
    }
    public componentDidMount() {
        this.props.getBalance(
            this.props.account.blockchain,
            this.props.account.address,
            undefined,
            false // should we actually force it?
        );
    }

    @bind
    tabPressed(tab: string) {
        this.setState({ activeTab: tab });
    }

    renderTabs() {
        const config = getBlockchain(this.props.blockchain).config;
        switch (this.state.activeTab) {
            case config.ui.token.labels.tabAccount:
                return <AccountTab></AccountTab>;
            case config.ui.token.labels.tabDelegations:
                return <DelegationsTab></DelegationsTab>;
            case config.ui.token.labels.tabValidators:
                return <ValidatorsTab></ValidatorsTab>;
            case config.ui.token.labels.tabTransactions:
                return <TransactionsTab></TransactionsTab>;
        }
    }

    renderTabButtons() {
        const { styles } = this.props;
        const stylesTabActive = [styles.tabInactive, styles.tabActive];
        const stylesTabInactive = [styles.tabInactive];
        const stylesTextActive = [styles.tabTextInactive, styles.tabTextActive];
        const stylesTextInactive = [styles.tabTextInactive];

        const config = getBlockchain(this.props.blockchain).config;

        return (
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={
                        this.state.activeTab === config.ui.token.labels.tabAccount
                            ? stylesTabActive
                            : stylesTabInactive
                    }
                    onPress={() => this.tabPressed(config.ui.token.labels.tabAccount)}
                >
                    <Text
                        style={
                            this.state.activeTab === config.ui.token.labels.tabAccount
                                ? stylesTextActive
                                : stylesTextInactive
                        }
                    >
                        {translate(config.ui.token.labels.tabAccount)}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={
                        this.state.activeTab === config.ui.token.labels.tabDelegations
                            ? stylesTabActive
                            : stylesTabInactive
                    }
                    onPress={() => this.tabPressed(config.ui.token.labels.tabDelegations)}
                >
                    <Text
                        style={
                            this.state.activeTab === config.ui.token.labels.tabDelegations
                                ? stylesTextActive
                                : stylesTextInactive
                        }
                    >
                        {translate(config.ui.token.labels.tabDelegations)}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={
                        this.state.activeTab === config.ui.token.labels.tabValidators
                            ? stylesTabActive
                            : stylesTabInactive
                    }
                    onPress={() => this.tabPressed(config.ui.token.labels.tabValidators)}
                >
                    <Text
                        style={
                            this.state.activeTab === config.ui.token.labels.tabValidators
                                ? stylesTextActive
                                : stylesTextInactive
                        }
                    >
                        {translate(config.ui.token.labels.tabValidators)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={
                        this.state.activeTab === config.ui.token.labels.tabTransactions
                            ? stylesTabActive
                            : stylesTabInactive
                    }
                    onPress={() => this.tabPressed(config.ui.token.labels.tabTransactions)}
                >
                    <Text
                        style={
                            this.state.activeTab === config.ui.token.labels.tabTransactions
                                ? stylesTextActive
                                : stylesTextInactive
                        }
                    >
                        {translate(config.ui.token.labels.tabTransactions)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    public render() {
        const { styles } = this.props;
        return (
            <View style={styles.container}>
                {this.renderTabButtons()}
                {this.renderTabs()}
                <PasswordModal obRef={ref => (this.passwordModal = ref)} />
            </View>
        );
    }
}

export const DelegateTokenScreen = smartConnect<IProps>(DelegateTokenScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
