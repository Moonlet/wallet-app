import React from 'react';
import { View, ScrollView, Platform, Image } from 'react-native';
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
import { Button, Text } from '../../../../library';
import { translate, Translate } from '../../../../core/i18n';
import { INavigationProps } from '../../../../navigation/with-navigation-params';
import { AccountAddress } from '../../../../components/account-address/account-address';
import { Blockchain, IBlockchainTransaction, ChainIdType } from '../../../../core/blockchain/types';
import { TransactionsHistoryList } from '../../../transactions-history/list-transactions-history/list-transactions-history';
import {
    sendTransferTransaction,
    updateTransactionFromBlockchain
} from '../../../../redux/wallets/actions';
import { getChainId } from '../../../../redux/preferences/selectors';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { TransactionStatus } from '../../../../core/wallet/types';
import { NavigationService } from '../../../../navigation/navigation-service';
import {
    isFeatureActive,
    remoteFeatureSwapContainsToken,
    RemoteFeature
} from '../../../../core/utils/remote-feature-config';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { ApiClient } from '../../../../core/utils/api-client/api-client';
import { sendTransactions } from '../../../../redux/ui/screens/data/actions/transactions';
import { PosBasicActionType, TokenType } from '../../../../core/blockchain/types/token';
import { LoadingModal } from '../../../../components/loading-modal/loading-modal';
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
} from '@sentry/react-native';
import { Dialog } from '../../../../components/dialog/dialog';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { Client as SolanaClient } from '../../../../core/blockchain/solana/client';
import { LoadingIndicator } from '../../../../components/loading-indicator/loading-indicator';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

interface IProps {
    accountIndex: number;
    blockchain: Blockchain;
    token: ITokenState;
    navigation: NavigationScreenProp<NavigationState>;
}

interface IReduxProps {
    account: IAccountState;
    transactions: IBlockchainTransaction[];
    wallet: IWalletState;
    sendTransferTransaction: typeof sendTransferTransaction;
    chainId: ChainIdType;
    canSend: boolean;
    updateTransactionFromBlockchain: typeof updateTransactionFromBlockchain;
    sendTransactions: typeof sendTransactions;
}

const mapStateToProps = (state: IReduxState, ownProps: IProps) => {
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
        canSend: Platform.OS !== 'web' || state.ui.extension.stateLoaded
    };
};

const mapDispatchToProps = {
    sendTransferTransaction,
    updateTransactionFromBlockchain,
    sendTransactions
};

interface IState {
    splToken: {
        state: 'default' | 'inactive' | 'active';
    };
}

class DefaultTokenScreenComponent extends React.Component<
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

        this.state = {
            splToken: undefined
        };
    }

    public async componentDidMount() {
        const { account, chainId, token } = this.props;
        const { blockchain } = account;

        const tokenConfig = getTokenConfig(blockchain, token.symbol);

        if (blockchain === Blockchain.SOLANA && tokenConfig.type === TokenType.SPL) {
            this.setState({
                splToken: {
                    state: 'default'
                }
            });

            const client = getBlockchain(blockchain).getClient(chainId);

            try {
                const isActive = await (client as SolanaClient).isActiveToken(
                    tokenConfig.contractAddress,
                    account.address,
                    TokenType.SPL
                );

                this.setState({
                    splToken: {
                        state: isActive ? 'active' : 'inactive'
                    }
                });
            } catch (error) {
                //
            }
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

    private async activateSolanaSplToken() {
        await LoadingModal.open();

        const { account, chainId, token } = this.props;

        const tokenConfig = getTokenConfig(account.blockchain, token.symbol);

        try {
            const response = await new ApiClient().http.post('/transactions/buildParams', {
                blockchain: Blockchain.SOLANA,
                chainId,
                params: {
                    posAction: PosBasicActionType.SOLANA_CREATE_ASSOCIATED_TOKEN_ACCOUNT,
                    baseAccountKey: account.address,
                    mint: tokenConfig.contractAddress,
                    tokenSymbol: token.symbol
                }
            });

            const tx = response?.result?.data;
            if (tx)
                this.props.sendTransactions({
                    action: {
                        type: undefined,
                        params: {
                            params: [tx]
                        }
                    }
                });
            else {
                await Dialog.info(
                    translate('App.labels.warning'),
                    translate('App.labels.somethingWrong')
                );

                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        data: {
                            blockchain: Blockchain.SOLANA,
                            chainId,
                            params: {
                                posAction:
                                    PosBasicActionType.SOLANA_CREATE_ASSOCIATED_TOKEN_ACCOUNT,
                                baseAccountKey: account.address,
                                mint: tokenConfig.contractAddress
                            }
                        }
                    })
                });

                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        api: response
                    })
                });

                SentryCaptureException(
                    new Error(`Cannot create associated token account, ${token.symbol}`)
                );
            }
        } catch (error) {
            await Dialog.info(
                translate('App.labels.warning'),
                translate('App.labels.somethingWrong')
            );

            SentryAddBreadcrumb({
                message: JSON.stringify({
                    data: {
                        blockchain: Blockchain.SOLANA,
                        chainId,
                        params: {
                            posAction: PosBasicActionType.SOLANA_CREATE_ASSOCIATED_TOKEN_ACCOUNT,
                            baseAccountKey: account.address,
                            mint: tokenConfig.contractAddress
                        }
                    },
                    error
                })
            });

            SentryCaptureException(
                new Error(
                    `Cannot create associated token account, ${token.symbol}, ${error?.message}`
                )
            );
        }

        await LoadingModal.close();
    }

    public render() {
        const { styles, navigation, account, transactions, token } = this.props;

        return (
            <View testID="default-token-screen" style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <AccountAddress account={account} token={token} />

                    {this.state.splToken?.state === 'default' ? (
                        <LoadingIndicator />
                    ) : (
                        <View style={{ flex: 1 }}>
                            <View style={styles.buttonsContainer}>
                                <Button
                                    testID="send-button"
                                    style={styles.button}
                                    wrapperStyle={{ flex: 1 }}
                                    // disabled={!this.props.canSend} // TODOO
                                    onPress={() => {
                                        navigation.navigate('Send', {
                                            accountIndex: account.index,
                                            blockchain: account.blockchain,
                                            token
                                        });
                                    }}
                                    disabledSecondary={this.state.splToken?.state === 'inactive'}
                                >
                                    {translate('App.labels.send')}
                                </Button>

                                <Button
                                    testID="receive-button"
                                    style={styles.button}
                                    wrapperStyle={{ flex: 1 }}
                                    onPress={() => {
                                        navigation.navigate('Receive', {
                                            accountIndex: account.index,
                                            blockchain: account.blockchain,
                                            token
                                        });
                                    }}
                                >
                                    {translate('App.labels.receive')}
                                </Button>

                                {isFeatureActive(RemoteFeature.SWAP_TOKENS) &&
                                    token?.symbol &&
                                    remoteFeatureSwapContainsToken(token.symbol) && (
                                        <Button
                                            style={styles.button}
                                            wrapperStyle={{ flex: 1 }}
                                            onPress={() =>
                                                NavigationService.navigate('SmartScreen', {
                                                    context: {
                                                        screen: 'Swap',
                                                        step: 'SwapEnterAmount',
                                                        key: 'swap-enter-amount',
                                                        params: { token: token.symbol }
                                                    },
                                                    navigationOptions: {
                                                        title: translate('App.labels.swap')
                                                    },
                                                    newFlow: true,
                                                    resetScreen: true
                                                })
                                            }
                                        >
                                            {translate('App.labels.swap')}
                                        </Button>
                                    )}
                            </View>

                            {this.state.splToken?.state === 'inactive' ? (
                                <View style={{ flex: 1 }}>
                                    <View style={styles.emptySection}>
                                        <Image
                                            style={styles.logoImage}
                                            source={require('../../../../assets/images/png/moonlet_space_gray.png')}
                                        />

                                        <Text style={styles.emptySectionTitle}>
                                            {translate('Send.activateAccount')}
                                        </Text>
                                        <Text style={styles.emptySectionSubtitle}>
                                            {translate('Send.activateAccountDetails')}
                                        </Text>
                                    </View>

                                    <View style={{ marginBottom: BASE_DIMENSION * 4 }}>
                                        <Button
                                            style={styles.button}
                                            wrapperStyle={{ flex: 1 }}
                                            primary
                                            onPress={() => this.activateSolanaSplToken()}
                                        >
                                            {translate('App.labels.activateAccount')}
                                        </Button>
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <Translate
                                        text="App.labels.transactions"
                                        style={styles.transactionsTitle}
                                    />
                                    <TransactionsHistoryList
                                        transactions={transactions}
                                        account={account}
                                        navigation={navigation}
                                        onRefresh={() => this.updateTransactionFromBlockchain()}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        );
    }
}

export const DefaultTokenScreen = smartConnect<IProps>(DefaultTokenScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
