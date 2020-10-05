import React from 'react';
import { View, ScrollView } from 'react-native';
import { INavigationProps } from '../../navigation/with-navigation-params';
import { IReduxState } from '../../redux/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { translate } from '../../core/i18n';
import { getSelectedAccount, getAccounts } from '../../redux/wallets/selectors';
import { IAccountState } from '../../redux/wallets/state';
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

interface IReduxProps {
    selectedAccount: IAccountState;
    exchangeRates: IExchangeRates;
    accounts: IAccountState[];
    chainId: ChainIdType;
}

const mapStateToProps = (state: IReduxState) => {
    const selectedAccount = getSelectedAccount(state);

    return {
        selectedAccount,
        accounts: selectedAccount ? getAccounts(state, selectedAccount.blockchain) : [],
        exchangeRates: state.market.exchangeRates,
        chainId: getChainId(state, selectedAccount.blockchain)
    };
};

export const navigationOptions = () => ({
    title: translate('Account.manageAccounts')
});

export class ManageAccountsComponent extends React.Component<
    INavigationProps & IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
> {
    public static navigationOptions = navigationOptions;

    private renderAccount(account: IAccountState) {
        const { styles } = this.props;

        const blockchainConfig = getBlockchain(account.blockchain).config;
        const tokenConfig = getTokenConfig(account.blockchain, blockchainConfig.coin);
        const balance =
            account &&
            calculateBalance(account, this.props.chainId, this.props.exchangeRates, tokenConfig);

        return (
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
                    visible: false
                }}
                draggable={{
                    visible: false
                }}
                imageIcon={{ iconComponent: blockchainConfig.iconComponent }}
            />
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
                    {this.props.accounts.map((account: IAccountState) =>
                        this.renderAccount(account)
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
    connect(mapStateToProps, null),
    withTheme(stylesProvider)
]);
