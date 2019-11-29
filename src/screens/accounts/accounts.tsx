import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { IReduxState } from '../../redux/state';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { IWalletState, IAccountState } from '../../redux/wallets/state';
import { addAccount, removeAccount } from '../../redux/wallets/actions';
import { HeaderLeftClose } from '../../components/header-left-close/header-left-close';
import { INavigationProps, withNavigationParams } from '../../navigation/with-navigation-params';
import { ListCard } from '../../components/list-card/list-card';
import stylesProvider from './styles';
import { Blockchain } from '../../core/blockchain/types';
import { HDWallet } from '../../core/wallet/hd-wallet/hd-wallet';
import { selectCurrentWallet } from '../../redux/wallets/selectors';
import { formatAddress } from '../../core/utils/format-address';
import { Text } from '../../library';
import { Amount } from '../../components/amount/amount';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { LoadingIndicator } from '../../components/loading-indicator/loading-indicator';
import { PasswordModal } from '../../components/password-modal/password-modal';

export interface IReduxProps {
    wallet: IWalletState;

    addAccount: typeof addAccount;
    removeAccount: typeof removeAccount;
}

export interface INavigationParams {
    blockchain: Blockchain;
}

const mapStateToProps = (state: IReduxState) => {
    const wallet = selectCurrentWallet(state);

    return {
        wallet
    };
};

const mapDispatchToProps = {
    addAccount,
    removeAccount
};

export const AccountsScreenComponent = (
    props: IReduxProps &
        INavigationProps<INavigationParams> &
        IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const [accounts, setAccounts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const selectedAccounts = props.wallet.accounts.reduce((out: any, account: IAccountState) => {
        if (account.blockchain === props.blockchain) {
            out.push(account.address);
        }

        return out;
    }, []);

    useEffect(() => {
        (async function getAccounts() {
            try {
                const password = await this.passwordModal.requestPassword();

                const wallet = await HDWallet.loadFromStorage(props.wallet.id, password);
                const hdAccounts = await wallet.getAccounts(props.blockchain, 0, 4);
                setAccounts(hdAccounts);

                const client = getBlockchain(props.blockchain).getClient(4);

                const balanceCalls = [];
                hdAccounts.map(account => {
                    balanceCalls.push(client.getBalance(account.address));
                });

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

                setIsLoading(false);
            } catch (e) {
                // console.log(e);
            }
        })();
    }, [props.blockchain]);

    return (
        <View style={props.styles.container}>
            {isLoading ? (
                <LoadingIndicator />
            ) : (
                accounts.map((account: IAccountState, i: number) => {
                    const selected = selectedAccounts.indexOf(account.address) !== -1;
                    const label = (
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                <Amount
                                    amount={account.balance?.value}
                                    blockchain={account.blockchain}
                                />
                                <Amount
                                    style={{ fontSize: 12, marginLeft: 8 }}
                                    amount={account.balance?.value}
                                    blockchain={account.blockchain}
                                    convert
                                />
                            </View>
                            <Text small>{formatAddress(account.address)}</Text>
                        </View>
                    );
                    return (
                        <ListCard
                            key={i}
                            leftIcon="money-wallet-1"
                            rightIcon={selected ? 'check-2-thicked' : 'check-2'}
                            label={label}
                            selected={selected}
                            onPress={() => {
                                selected
                                    ? selectedAccounts.length > 1 &&
                                      props.removeAccount(
                                          props.wallet.id,
                                          props.blockchain,
                                          account
                                      )
                                    : props.addAccount(props.wallet.id, props.blockchain, account);
                            }}
                        />
                    );
                })
            )}
            <PasswordModal obRef={ref => (this.passwordModal = ref)} />
        </View>
    );
};

const navigationOptions = ({ navigation }: any) => ({
    headerLeft: <HeaderLeftClose navigation={navigation} />,
    title: 'Accounts'
});

AccountsScreenComponent.navigationOptions = navigationOptions;

export const AccountsScreen = smartConnect(AccountsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider),
    withNavigationParams()
]);
