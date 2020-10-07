import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../core/i18n';
import { getSelectedAccount, getAccounts, getSelectedWallet } from '../../redux/wallets/selectors';
import { IAccountState, IWalletState } from '../../redux/wallets/state';
import { Button, Text } from '../../library';
import { DraggableCardWithCheckbox } from '../../components/draggable-card-with-check-box/draggable-card-with-check-box';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { Amount } from '../../components/amount/amount';
import { formatAddress } from '../../core/utils/format-address';
import { calculateBalance } from '../../core/utils/balance';
import { getChainId } from '../../redux/preferences/selectors';
import { IExchangeRates } from '../../redux/market/state';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { NavigationService } from '../../navigation/navigation-service';
import { Dialog } from '../../components/dialog/dialog';
import Icon from '../../components/icon/icon';
import { IconValues } from '../../components/icon/values';
import { normalize } from '../../styles/dimensions';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { removeAccount } from '../../redux/wallets/actions';

interface IReduxProps {
    selectedAccount: IAccountState;
    exchangeRates: IExchangeRates;
    accounts: IAccountState[];
    chainId: ChainIdType;
    selectedWallet: IWalletState;
    removeAccount: typeof removeAccount;
}

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);

    return {
        selectedAccount,
        accounts: selectedAccount ? getAccounts(state, selectedAccount.blockchain) : [],
        exchangeRates: state.market.exchangeRates,
        chainId: getChainId(state, selectedAccount.blockchain),
        selectedWallet: getSelectedWallet(state)
    };
};

const mapDispatchToProps = {
    removeAccount
};

export const navigationOptions = () => ({
    title: translate('Account.manageAccounts')
});

export class ManageAccountsComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    public accountsSwipeableRef: ReadonlyArray<string> = [];
    public currentlyOpenSwipeable: string = null;

    public componentDidMount() {
        setTimeout(() => this.showHints(), 500);
    }

    private showHints() {
        if (this.props.accounts && this.props.accounts.length > 1) {
            const accountIndex = `account-1`; // Account 0 cannot be deleted
            this.onSwipeableWillOpen(accountIndex);
            this.accountsSwipeableRef[accountIndex] &&
                this.accountsSwipeableRef[accountIndex].openLeft();

            setTimeout(() => this.closeCurrentOpenedSwipable(), 1000);
        }
    }

    public closeCurrentOpenedSwipable() {
        this.accountsSwipeableRef[this.currentlyOpenSwipeable] &&
            this.accountsSwipeableRef[this.currentlyOpenSwipeable].close();
    }

    public renderLeftActions(account: IAccountState) {
        const styles = this.props.styles;
        return (
            <View style={styles.leftActionsContainer}>
                <TouchableOpacity
                    style={styles.action}
                    onPress={async () => {
                        if (
                            await Dialog.confirm(
                                translate('App.labels.removeAccount'),
                                translate('AddAccount.removeAccountConfirm', {
                                    name: account.address
                                })
                            )
                        ) {
                            this.props.removeAccount(
                                this.props.selectedWallet.id,
                                account.blockchain,
                                account
                            );
                        }
                        this.closeCurrentOpenedSwipable();
                    }}
                >
                    <Icon
                        name={IconValues.BIN}
                        size={normalize(32)}
                        style={styles.iconActionNegative}
                    />
                    <Text style={styles.textActionNegative}>{translate('App.labels.remove')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    public onSwipeableWillOpen(index: string) {
        if (
            index !== this.currentlyOpenSwipeable &&
            this.accountsSwipeableRef[this.currentlyOpenSwipeable]
        ) {
            this.closeCurrentOpenedSwipable();
        }

        this.currentlyOpenSwipeable = index;
    }

    private renderAccount(account: IAccountState, index: number) {
        const { styles } = this.props;

        const blockchainConfig = getBlockchain(account.blockchain).config;
        const tokenConfig = getTokenConfig(account.blockchain, blockchainConfig.coin);
        const balance =
            account &&
            calculateBalance(account, this.props.chainId, this.props.exchangeRates, tokenConfig);

        const swipeIndex = `account-${index}`;

        return (
            <Swipeable
                key={index}
                ref={ref => (this.accountsSwipeableRef[swipeIndex] = ref)}
                renderLeftActions={() =>
                    account.blockchain === Blockchain.NEAR &&
                    account.index !== 0 && // cannot delete index on position 0
                    this.renderLeftActions(account)
                }
                onSwipeableWillOpen={() => this.onSwipeableWillOpen(swipeIndex)}
            >
                <DraggableCardWithCheckbox
                    key={`account-${account.index}`}
                    mainText={
                        <View style={styles.firstRow}>
                            <Text style={this.props.styles.accountName}>
                                {`${translate('App.labels.account')} ${account.index + 1}`}
                            </Text>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={this.props.styles.accountAddress}
                            >
                                {formatAddress(account.address, account.blockchain)}
                            </Text>
                        </View>
                    }
                    subtitleText={
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <Amount
                                style={this.props.styles.fistAmountText}
                                amount={balance}
                                blockchain={account.blockchain}
                                token={blockchainConfig.coin}
                                tokenDecimals={tokenConfig.decimals}
                            />
                            <Amount
                                style={this.props.styles.secondAmountText}
                                amount={balance}
                                blockchain={account.blockchain}
                                token={blockchainConfig.coin}
                                tokenDecimals={tokenConfig.decimals}
                                convert
                            />
                        </View>
                    }
                    isActive={true}
                    checkBox={{
                        visible: false // TODO: implement this
                    }}
                    draggable={{
                        visible: false // TODO: implement this
                    }}
                    imageIcon={{ iconComponent: blockchainConfig.iconComponent }}
                />
            </Swipeable>
        );
    }

    public render() {
        const { styles } = this.props;
        const { blockchain } = this.props.selectedAccount;
        const disableButton =
            this.props.accounts.length === getBlockchain(blockchain).config.ui.maxAccountsNumber;

        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {this.props.accounts.map((account: IAccountState, index: number) =>
                        this.renderAccount(account, index)
                    )}
                </ScrollView>

                {blockchain === Blockchain.NEAR && (
                    <View style={styles.bottomContainer}>
                        <Button
                            onPress={() => NavigationService.navigate('RecoverNearAccount', {})}
                            wrapperStyle={styles.bottomButton}
                            disabled={disableButton}
                        >
                            {translate('AddNearAccount.recoverAccount')}
                        </Button>

                        <Button
                            primary
                            onPress={() => NavigationService.navigate('CreateNearAccount', {})}
                            wrapperStyle={styles.bottomButton}
                            disabled={disableButton}
                        >
                            {translate('AddNearAccount.createAccount')}
                        </Button>
                    </View>
                )}
            </View>
        );
    }
}

export const ManageAccountsScreen = smartConnect(ManageAccountsComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
