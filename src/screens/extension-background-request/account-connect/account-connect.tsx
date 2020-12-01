import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Text } from '../../../library';
import stylesProvider from './styles';
import { smartConnect } from '../../../core/utils/smart-connect';
import { IThemeProps, withTheme } from '../../../core/theme/with-theme';
import { translate } from '../../../core/i18n';
import bind from 'bind-decorator';
import { IReduxState } from '../../../redux/state';
import { IAccountState, IWalletsState, IWalletState } from '../../../redux/wallets/state';
import { connect } from 'react-redux';
import { BASE_DIMENSION } from '../../../styles/dimensions';
import {} from 'react-native-gesture-handler';
import { IconValues } from '../../../components/icon/values';
import { Blockchain, ChainIdType } from '../../../core/blockchain/types';
import { getChainId } from '../../../redux/preferences/selectors';
import { IExchangeRates } from '../../../redux/market/state';
import { formatAddress } from '../../../core/utils/format-address';
import { WalletType } from '../../../core/wallet/types';
import { ListCard } from '../../../components/list-card/list-card';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { calculateBalance } from '../../../core/utils/balance';
import { Amount } from '../../../components/amount/amount';
import { IExtensionRequest } from '../../../core/communication/extension';
import klona from 'klona';

interface IExternalProps {
    request: IExtensionRequest;
    onResponse: (response: any) => any;
}

interface IReduxProps {
    wallets: IWalletsState;
    exchangeRates: IExchangeRates;
    chainId: ChainIdType;
}

const mapStateToProps = (state: IReduxState) => {
    const blockchain = Blockchain.ZILLIQA;

    return {
        wallets: state.wallets,
        exchangeRates: state.market.exchangeRates,
        chainId: getChainId(state, blockchain)
    };
};

interface IState {
    selectedWallet: IWalletState;
    selectedAccounts: {
        walletPubKey: string;
        blockchain: Blockchain;
        address: string;
    }[];
}

export class AccountConnectComp extends React.Component<
    IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(
        props: IExternalProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
    ) {
        super(props);
        this.state = {
            selectedWallet: undefined,
            selectedAccounts: []
        };
    }

    @bind
    private onCancel() {
        this.props.onResponse({
            jsonrpc: '2.0',
            error: {
                code: -1,
                message: 'CANCELED_BY_USER: Operation cancelled by user'
            }
        });
    }

    @bind
    private async onConnect() {
        this.props.onResponse({
            jsonrpc: '2.0',
            result: this.state.selectedAccounts
        });
    }

    private onAccountSelect(account: IAccountState, wallet: IWalletState) {
        // Add or remove account
        const selectedAccounts =
            this.state.selectedWallet === wallet ? klona(this.state.selectedAccounts) : [];

        const indexOfAccount = selectedAccounts.findIndex(
            acc =>
                acc.address === account.address &&
                [wallet.walletPublicKey, wallet.id].indexOf(acc.walletPubKey) >= 0
        );

        if (indexOfAccount < 0) {
            // add address
            selectedAccounts.push({
                walletPubKey: wallet.walletPublicKey || wallet.id,
                address: account.address,
                blockchain: account.blockchain
            });
        } else {
            selectedAccounts.splice(indexOfAccount, 1);
            // remove address
        }

        this.setState({ selectedAccounts });

        if (this.state.selectedWallet !== wallet) {
            // Another wallet has been selected
            this.setState({ selectedWallet: wallet });
        }
    }

    public render() {
        const { styles, theme } = this.props;

        // TODO: maybe move this
        const platformUrl = this.props.request.origin;

        const blockchainPlatform = this.props.request.blockchain;

        const blockchainConfig = getBlockchain(blockchainPlatform).config;
        const BlockchainIcon = blockchainConfig.iconComponent;
        const tokenConfig = getTokenConfig(blockchainPlatform, blockchainConfig.coin);

        return (
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>
                        {translate('ExtensionBackgroundRequest.connectMoonlet')}
                    </Text>
                </View>

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: BASE_DIMENSION * 2 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text>
                        <Text style={styles.allowText}>{translate('App.labels.allow')}</Text>
                        <Text style={[styles.allowText, { color: theme.colors.positive }]}>
                            {` ${platformUrl} `}
                        </Text>
                        <Text style={styles.allowText}>
                            {translate('ExtensionBackgroundRequest.viewAddress')}
                        </Text>
                    </Text>

                    {Object.values(this.props.wallets).map((wallet: IWalletState) => {
                        return (
                            <View>
                                <Text style={styles.sectionLabel}>{wallet.name}</Text>

                                {wallet.accounts.map((account: IAccountState) => {
                                    if (account.blockchain !== blockchainPlatform) {
                                        return;
                                    }

                                    const selected =
                                        this.state.selectedAccounts.findIndex(
                                            acc =>
                                                acc.address === account.address &&
                                                acc.blockchain === blockchainPlatform &&
                                                [wallet.walletPublicKey, wallet.id].indexOf(
                                                    acc.walletPubKey
                                                ) >= 0
                                        ) >= 0;

                                    const balance = calculateBalance(
                                        account,
                                        this.props.chainId,
                                        this.props.exchangeRates,
                                        getTokenConfig(account.blockchain, blockchainConfig.coin)
                                    );

                                    const label = (
                                        <View>
                                            <View style={this.props.styles.firstRow}>
                                                <Text style={this.props.styles.accountName}>
                                                    {`${translate(
                                                        'App.labels.account'
                                                    )} ${account.index + 1}`}
                                                </Text>
                                                <Text style={this.props.styles.accountAddress}>
                                                    {formatAddress(
                                                        account.address,
                                                        blockchainPlatform
                                                    )}
                                                </Text>
                                            </View>
                                            <View style={styles.amountContainer}>
                                                <Amount
                                                    style={this.props.styles.amountContainer}
                                                    amount={balance}
                                                    blockchain={blockchainPlatform}
                                                    token={blockchainConfig.coin}
                                                    tokenDecimals={tokenConfig.decimals}
                                                    numberOfLines={1}
                                                />
                                                <Amount
                                                    style={this.props.styles.amountConvertedText}
                                                    amount={balance}
                                                    blockchain={blockchainPlatform}
                                                    token={blockchainConfig.coin}
                                                    tokenDecimals={tokenConfig.decimals}
                                                    convert
                                                    numberOfLines={1}
                                                />
                                            </View>
                                        </View>
                                    );

                                    return (
                                        <ListCard
                                            onPress={() => this.onAccountSelect(account, wallet)}
                                            leftIcon={
                                                wallet.type === WalletType.HW
                                                    ? IconValues.LEDGER_LOOGO
                                                    : BlockchainIcon
                                            }
                                            label={label}
                                            rightIcon={selected ? IconValues.CHECK : null}
                                            selected={selected}
                                        />
                                    );
                                })}
                            </View>
                        );
                    })}
                </ScrollView>

                <View>
                    {/* <TouchableOpacity onPress={() => window.open('https://moonlet.io/')}>
                        <Text>
                            <Text style={styles.bottomText}>
                                {translate('ExtensionBackgroundRequest.makeSure')}
                            </Text>
                            <Text style={styles.bottomText}>{` - `}</Text>
                            <Text style={[styles.bottomText, { color: theme.colors.accent }]}>
                                {translate('App.labels.learnMore')}
                            </Text>
                        </Text>
                    </TouchableOpacity> */}

                    <View style={styles.bottomButtonsContainer}>
                        <Button wrapperStyle={styles.bottomLeftButton} onPress={this.onCancel}>
                            {translate('App.labels.cancel')}
                        </Button>
                        <Button
                            primary
                            wrapperStyle={styles.bottomRightButton}
                            onPress={this.onConnect}
                            disabled={!this.state.selectedWallet}
                        >
                            {translate('App.labels.connect')}
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}

export const AccountConnectComponent = smartConnect<IExternalProps>(AccountConnectComp, [
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
