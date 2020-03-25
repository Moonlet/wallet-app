import React from 'react';
import { View, Platform } from 'react-native';
import { HeaderRight } from '../../components/header-right/header-right';
import stylesProvider from './styles';
import { IAccountState, IWalletState } from '../../redux/wallets/state';
import {
    getAccountFilteredTransactions,
    getAccount,
    getSelectedWallet
} from '../../redux/wallets/selectors';
import { IReduxState } from '../../redux/state';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { withTheme } from '../../core/theme/with-theme';
import { connect } from 'react-redux';
import { smartConnect } from '../../core/utils/smart-connect';
import { Text } from '../../library';
import { translate } from '../../core/i18n';
import { withNavigationParams, INavigationProps } from '../../navigation/with-navigation-params';
import { Blockchain, IBlockchainTransaction, ChainIdType } from '../../core/blockchain/types';
import { themes } from '../../navigation/navigation';
import {
    sendTransferTransaction,
    getBalance,
    updateTransactionFromBlockchain
} from '../../redux/wallets/actions';
import { getChainId } from '../../redux/preferences/selectors';
import { TestnetBadge } from '../../components/testnet-badge/testnet-badge';
import { ITokenConfig, TokenScreenComponentType } from '../../core/blockchain/types/token';
import { DefaultTokenScreen } from './components/default-token/default-token';
import { DelegateTokenScreen } from './components/delegate-token/delegate-token';
import { AccountSettings } from './components/account-settings/account-settings';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { ExtensionConnectionInfo } from '../../components/extension-connection-info/extension-connection-info';
import { SmartImage } from '../../library/image/smart-image';
import { BASE_DIMENSION, normalize } from '../../styles/dimensions';
import { TransactionStatus } from '../../core/wallet/types';

export interface IProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    styles: ReturnType<typeof stylesProvider>;
}

export interface IReduxProps {
    account: IAccountState;
    transactions: IBlockchainTransaction[];
    wallet: IWalletState;
    sendTransferTransaction: typeof sendTransferTransaction;
    chainId: ChainIdType;
    getBalance: typeof getBalance;
    updateTransactionFromBlockchain: typeof updateTransactionFromBlockchain;
}

export interface INavigationParams {
    accountIndex: number;
    blockchain: Blockchain;
    extensionTransactionPayload: any; // TODO add typing
    token: ITokenConfig;
}

interface IState {
    settingsVisible: boolean;
}

export const mapStateToProps = (state: IReduxState, ownProps: INavigationParams) => {
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
    getBalance,
    updateTransactionFromBlockchain
};

const navigationOptions = ({ navigation, theme }: any) => ({
    headerRight: () => (
        <HeaderRight
            icon="navigation-menu-horizontal"
            onPress={navigation.state.params ? navigation.state.params.openSettingsMenu : undefined}
        />
    ),
    headerTitle: () => {
        const BlockchainIcon = getBlockchain(navigation.state.params.blockchain).config
            .iconComponent;

        return (
            <View style={{ flexDirection: 'row' }}>
                <SmartImage
                    source={{ iconComponent: BlockchainIcon }}
                    style={{ marginRight: BASE_DIMENSION }}
                    small
                />
                <Text
                    style={{
                        fontSize: normalize(22),
                        lineHeight: normalize(28),
                        color: themes[theme].colors.text,
                        letterSpacing: 0.38,
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}
                >
                    {`${translate('App.labels.account')} ${navigation.state.params.accountIndex +
                        1}`}
                </Text>
            </View>
        );
    }
});

export class TokenScreenComponent extends React.Component<
    INavigationProps<INavigationParams> & IReduxProps & IProps,
    IState
> {
    public static navigationOptions = navigationOptions;
    public passwordModal: any;

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
        this.props.getBalance(
            this.props.account.blockchain,
            this.props.account.address,
            undefined,
            false // should we actually force it?
        );

        this.props.transactions?.map((transaction: IBlockchainTransaction) => {
            if (transaction.status === TransactionStatus.PENDING) {
                this.props.updateTransactionFromBlockchain(
                    transaction.id,
                    transaction.blockchain,
                    transaction.chainId,
                    false
                );
            }
        });
    }

    public openSettingsMenu = () => this.setState({ settingsVisible: !this.state.settingsVisible });

    renderComponent() {
        switch (this.props.token.ui.tokenScreenComponent) {
            case TokenScreenComponentType.DELEGATE:
                return (
                    <DelegateTokenScreen
                        accountIndex={this.props.accountIndex}
                        blockchain={this.props.blockchain}
                        token={this.props.token}
                        extensionTransactionPayload={this.props.extensionTransactionPayload}
                        navigation={this.props.navigation}
                    />
                );
            default:
                return (
                    <DefaultTokenScreen
                        accountIndex={this.props.accountIndex}
                        blockchain={this.props.blockchain}
                        token={this.props.token}
                        extensionTransactionPayload={this.props.extensionTransactionPayload}
                        navigation={this.props.navigation}
                    />
                );
        }
    }

    public render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <TestnetBadge />
                {Platform.OS === 'web' && <ExtensionConnectionInfo />}
                {this.renderComponent()}
                {this.state.settingsVisible && (
                    <AccountSettings
                        onDonePressed={this.openSettingsMenu}
                        account={this.props.account}
                        wallet={this.props.wallet}
                        chainId={this.props.chainId}
                    />
                )}
            </View>
        );
    }
}

export const TokenScreen = smartConnect(TokenScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
