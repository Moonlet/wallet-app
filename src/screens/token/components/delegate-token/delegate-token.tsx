import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { IAccountState, IWalletState, ITokenState } from '../../../../redux/wallets/state';
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
import { getChainId } from '../../../../redux/preferences/selectors';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import bind from 'bind-decorator';
import { AccountTab } from './components/tabs/account-tab/account-tab';
import { DelegationsTab } from './components/tabs/delegations-tab/delegations-tab';
import { ValidatorsTab } from './components/tabs/validators-tab/validators-tab';
import { TransactionsTab } from './components/tabs/transactions-tab/transactions-tab';
import { NavigationScreenProp, NavigationState } from 'react-navigation';

export interface IProps {
    accountIndex: number;
    blockchain: Blockchain;
    extensionTransactionPayload: any; // TODO add typing
    token: ITokenState;
    navigation: NavigationScreenProp<NavigationState>;
}

export interface IReduxProps {
    account: IAccountState;
    transactions: IBlockchainTransaction[];
    wallet: IWalletState;
    chainId: ChainIdType;
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

export class DelegateTokenScreenComponent extends React.Component<
    INavigationProps & IProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
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

    @bind
    tabPressed(tab: string) {
        this.setState({ activeTab: tab });
    }

    // export interface IProps {
    //     accountIndex: number;
    //     blockchain: Blockchain;
    //     extensionTransactionPayload: any; // TODO add typing
    //     token: ITokenConfig;
    // }
    renderTabs() {
        const config = getBlockchain(this.props.blockchain).config;
        switch (this.state.activeTab) {
            case config.ui.token.labels.tabAccount:
                return (
                    <AccountTab
                        accountIndex={this.props.accountIndex}
                        blockchain={this.props.blockchain}
                        extensionTransactionPayload={this.props.extensionTransactionPayload}
                        token={this.props.token}
                    ></AccountTab>
                );
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
            </View>
        );
    }
}

export const DelegateTokenScreen = smartConnect<IProps>(DelegateTokenScreenComponent, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
