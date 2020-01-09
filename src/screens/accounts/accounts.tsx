import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { IReduxState } from '../../redux/state';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { IWalletState, IAccountState } from '../../redux/wallets/state';
import { appSwitchAccount } from '../../redux/app/actions';
import stylesProvider from './styles';
import { Blockchain } from '../../core/blockchain/types';
import { selectCurrentWallet, selectCurrentAccount } from '../../redux/wallets/selectors';
import { formatAddress } from '../../core/utils/format-address';
import { Text } from '../../library';
import { Amount } from '../../components/amount/amount';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { ListAccount } from '../account/components/list-account/list-account';
import { translate } from '../../core/i18n';

export interface IReduxProps {
    wallet: IWalletState;
    blockchain: Blockchain;
    appSwitchAccount: typeof appSwitchAccount;
    selectedAccount: IAccountState;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        blockchain: state.app.currentAccount.blockchain,
        wallet: selectCurrentWallet(state),
        selectedAccount: selectCurrentAccount(state)
    };
};

const mapDispatchToProps = {
    appSwitchAccount
};

export const navigationOptions = () => ({
    title: translate('DashboardMenu.manageAccount')
});

export const AccountsScreenComponent = (
    props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        (async function getAccounts() {
            try {
                const hdAccounts = props.wallet.accounts.filter(
                    (account: IAccountState) => account.blockchain === props.blockchain
                );
                setAccounts(hdAccounts);

                const client = getBlockchain(props.blockchain).getClient(4);

                const balanceCalls = [];
                hdAccounts.map(account => balanceCalls.push(client.getBalance(account.address)));

                // cache this somehow?
                Promise.all(balanceCalls).then(data => {
                    setAccounts(
                        hdAccounts.map((account, i) => {
                            account.balance = {
                                value: data[i],
                                inProgress: false,
                                timestamp: Date.now(),
                                error: undefined
                            };
                            return account;
                        })
                    );
                });
            } catch (e) {
                // console.log(e);
            }
        })();
    }, [props.blockchain]);

    return (
        <View style={props.styles.container}>
            {accounts.map((account: IAccountState, index: number) => {
                const selected = props.selectedAccount.address === account.address;

                const label = (
                    <View>
                        <View style={props.styles.firstRow}>
                            <Text style={props.styles.accountName}>
                                {`Account ${account.index + 1}`}
                            </Text>
                            <Text style={props.styles.accountAddress}>
                                {formatAddress(account.address)}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                            <Amount
                                style={props.styles.fistAmountText}
                                amount={account.balance?.value}
                                blockchain={account.blockchain}
                            />
                            <Amount
                                style={props.styles.secondAmountText}
                                amount={account.balance?.value}
                                blockchain={account.blockchain}
                                convert
                            />
                        </View>
                    </View>
                );
                return (
                    <ListAccount
                        key={index}
                        leftIcon="money-wallet-1"
                        rightIcon={selected ? 'check-1' : undefined}
                        label={label}
                        selected={selected}
                        onPress={() =>
                            props.appSwitchAccount({
                                index: account.index,
                                blockchain: account.blockchain
                            })
                        }
                    />
                );
            })}
        </View>
    );
};

AccountsScreenComponent.navigationOptions = navigationOptions;

export const AccountsScreen = smartConnect(AccountsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
