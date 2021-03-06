import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { IAccountState, IWalletState, ITokenState } from '../../../../redux/wallets/state';
import {
    getAccountFilteredTransactions,
    getAccount,
    getSelectedWallet,
    getNrPendingTransactions
} from '../../../../redux/wallets/selectors';
import { IReduxState } from '../../../../redux/state';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { connect } from 'react-redux';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { Text } from '../../../../library';
import { translate } from '../../../../core/i18n';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { Blockchain, IBlockchainTransaction, ChainIdType } from '../../../../core/blockchain/types';
import { getChainId } from '../../../../redux/preferences/selectors';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { AccountTab } from './components/tabs/account-tab/account-tab';
import { DelegationsTab } from './components/tabs/delegations-tab/delegations-tab';
import { ValidatorsTab } from './components/tabs/validators-tab/validators-tab';
import { TransactionsTab } from './components/tabs/transactions-tab/transactions-tab';
import { NavigationScreenProp, NavigationState, NavigationEvents } from 'react-navigation';
import { TransactionStatus } from '../../../../core/wallet/types';
import { updateTransactionFromBlockchain, getBalance } from '../../../../redux/wallets/actions';
import { fetchDelegatedValidators } from '../../../../redux/ui/delegated-validators/actions';
export interface IExternalProps {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    navigation: NavigationScreenProp<NavigationState>;
    activeTab?: string;
}

export interface IReduxProps {
    account: IAccountState;
    transactions: IBlockchainTransaction[];
    wallet: IWalletState;
    chainId: ChainIdType;
    getBalance: typeof getBalance;
    updateTransactionFromBlockchain: typeof updateTransactionFromBlockchain;
    fetchDelegatedValidators: typeof fetchDelegatedValidators;
    hasPendingTransactions: boolean;
}

export interface IState {
    activeTab: string;
}

const mapDispatchToProps = {
    getBalance,
    updateTransactionFromBlockchain,
    fetchDelegatedValidators
};

export const mapStateToProps = (state: IReduxState, ownProps: IExternalProps) => {
    return {
        account: getAccount(state, ownProps.accountIndex, ownProps.blockchain),
        transactions: getAccountFilteredTransactions(
            state,
            ownProps.accountIndex,
            ownProps.blockchain,
            ownProps.token
        ),
        wallet: getSelectedWallet(state),
        chainId: getChainId(state, ownProps.blockchain),
        hasPendingTransactions: getNrPendingTransactions(state)
    };
};

export class DelegateTokenScreenComponent extends React.Component<
    IExternalProps &
        INavigationProps &
        IReduxProps &
        IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(
        props: IExternalProps &
            INavigationProps &
            IReduxProps &
            IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);

        const config = getBlockchain(this.props.blockchain).config;
        this.state = {
            activeTab: props?.activeTab || config.ui.token.labels.tabAccount
        };
    }

    public componentDidMount() {
        const { navigation } = this.props;

        navigation.addListener('willFocus', () => {
            if (this.props.activeTab !== undefined) {
                this.setState({ activeTab: this.props.activeTab });

                const blockchainConfigTokenLabels = getBlockchain(this.props.blockchain).config.ui
                    .token.labels;

                if (this.props.activeTab === blockchainConfigTokenLabels.tabTransactions) {
                    this.updateTransactionFromBlockchain();
                } else if (this.props.activeTab === blockchainConfigTokenLabels.tabDelegations) {
                    this.props.fetchDelegatedValidators(this.props.account);
                }
            }
        });
    }

    public fetchAccountBalance() {
        if (this.props.account) {
            this.props.getBalance(
                this.props.account.blockchain,
                this.props.account.address,
                undefined,
                true
            );
        }
    }

    private updateTransactionFromBlockchain() {
        this.props.transactions?.map((transaction: IBlockchainTransaction) => {
            if (transaction.status === TransactionStatus.PENDING) {
                this.props.updateTransactionFromBlockchain(
                    transaction.id,
                    transaction.blockchain,
                    transaction.chainId,
                    transaction.broadcastedOnBlock
                );
            }
        });
    }

    private tabPressed(tab: string) {
        this.setState({ activeTab: tab });

        const blockchainConfigTokenLabels = getBlockchain(this.props.blockchain).config.ui.token
            .labels;
        if (tab === blockchainConfigTokenLabels.tabAccount) {
            this.fetchAccountBalance();
        }
        if (tab === blockchainConfigTokenLabels.tabTransactions) {
            this.updateTransactionFromBlockchain();
        } else if (tab === blockchainConfigTokenLabels.tabDelegations) {
            this.props.fetchDelegatedValidators(this.props.account);
        }
    }

    private renderTabs() {
        const config = getBlockchain(this.props.blockchain).config;
        switch (this.state.activeTab) {
            case config.ui.token.labels.tabAccount:
                return (
                    <AccountTab
                        accountIndex={this.props.accountIndex}
                        blockchain={this.props.blockchain}
                        token={this.props.token}
                    />
                );
            case config.ui.token.labels.tabDelegations:
                return (
                    <DelegationsTab
                        accountIndex={this.props.accountIndex}
                        blockchain={this.props.blockchain}
                        token={this.props.token}
                        chainId={this.props.chainId}
                    />
                );
            case config.ui.token.labels.tabValidators:
                return (
                    <ValidatorsTab
                        accountIndex={this.props.accountIndex}
                        blockchain={this.props.blockchain}
                        token={this.props.token}
                        chainId={this.props.chainId}
                    />
                );
            case config.ui.token.labels.tabTransactions:
                return (
                    <TransactionsTab
                        accountIndex={this.props.accountIndex}
                        blockchain={this.props.blockchain}
                        token={this.props.token}
                        navigation={this.props.navigation}
                    />
                );
        }
    }

    private renderTabButton(tabConfig: string) {
        const { styles } = this.props;
        const { activeTab } = this.state;

        const stylesTabActive = [styles.tabInactive, styles.tabActive];
        const stylesTabInactive = [styles.tabInactive];
        const stylesTextActive = [styles.tabTextInactive, styles.tabTextActive];
        const stylesTextInactive = [styles.tabTextInactive];

        return (
            <TouchableOpacity
                style={activeTab === tabConfig ? stylesTabActive : stylesTabInactive}
                onPress={() => this.tabPressed(tabConfig)}
            >
                <Text style={activeTab === tabConfig ? stylesTextActive : stylesTextInactive}>
                    {translate(tabConfig)}
                </Text>
            </TouchableOpacity>
        );
    }

    private renderTabButtons() {
        const { styles } = this.props;

        const config = getBlockchain(this.props.blockchain).config;

        return (
            <View style={styles.tabContainer}>
                {this.renderTabButton(config.ui.token.labels.tabAccount)}
                {this.renderTabButton(config.ui.token.labels.tabDelegations)}
                {this.renderTabButton(config.ui.token.labels.tabValidators)}
                {this.renderTabButton(config.ui.token.labels.tabTransactions)}
            </View>
        );
    }

    public render() {
        const { styles } = this.props;

        return (
            <View testID="delegate-token-screen" style={styles.container}>
                {this.renderTabButtons()}
                {this.renderTabs()}
                <NavigationEvents onWillFocus={() => this.fetchAccountBalance()} />
            </View>
        );
    }
}

export const DelegateTokenScreen = smartConnect<IExternalProps>(DelegateTokenScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
