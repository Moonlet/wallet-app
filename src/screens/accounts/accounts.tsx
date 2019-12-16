import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { IReduxState } from '../../redux/state';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { IWalletState, IAccountState } from '../../redux/wallets/state';
import { selectAccount } from '../../redux/wallets/actions';
import { ListCard } from '../../components/list-card/list-card';
import stylesProvider from './styles';
import { Blockchain } from '../../core/blockchain/types';
import { selectCurrentWallet } from '../../redux/wallets/selectors';
import { formatAddress } from '../../core/utils/format-address';
import { Text } from '../../library';
import { Amount } from '../../components/amount/amount';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';

export interface IReduxProps {
    wallet: IWalletState;
    blockchain: Blockchain;
    selectAccount: typeof selectAccount;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        blockchain: state.app.bottomSheet.blockchain,
        wallet: selectCurrentWallet(state)
    };
};

const mapDispatchToProps = {
    selectAccount
};

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
                const selected = props.wallet.selectedAccount.address === account.address;

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
                        key={index}
                        leftIcon="money-wallet-1"
                        rightIcon={selected ? 'check-2-thicked' : 'check-2'}
                        label={label}
                        selected={selected}
                        onPress={() =>
                            props.selectAccount(props.wallet.id, props.blockchain, account)
                        }
                    />
                );
            })}
        </View>
    );
};

export const AccountsScreen = smartConnect(AccountsScreenComponent, [
    connect(mapStateToProps, mapDispatchToProps),
    withTheme(stylesProvider)
]);
