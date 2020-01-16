import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { IReduxState } from '../../redux/state';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { smartConnect } from '../../core/utils/smart-connect';
import { connect } from 'react-redux';
import { IWalletState, IAccountState, TokenType } from '../../redux/wallets/state';
import { switchSelectedAccount, getBalance } from '../../redux/wallets/actions';
import stylesProvider from './styles';
import { Blockchain } from '../../core/blockchain/types';
import { selectCurrentWallet, getCurrentAccount } from '../../redux/wallets/selectors';
import { formatAddress } from '../../core/utils/format-address';
import { Text } from '../../library';
import { Amount } from '../../components/amount/amount';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { ListAccount } from '../token/components/list-account/list-account';
import BigNumber from 'bignumber.js';

export interface IReduxProps {
    wallet: IWalletState;
    switchSelectedAccount: typeof switchSelectedAccount;
    selectedAccount: IAccountState;
    getBalance: typeof getBalance;
    exchangeRates: any;
}

const mapStateToProps = (state: IReduxState) => {
    return {
        wallet: selectCurrentWallet(state),
        selectedAccount: getCurrentAccount(state),
        exchangeRates: (state as any).market.exchangeRates
    };
};

const mapDispatchToProps = {
    switchSelectedAccount,
    getBalance
};

// TODO: this is a component, not a screen any more => move this

export const AccountsScreenComponent = (
    props: IReduxProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        (async function getAccounts() {
            try {
                const hdAccounts = props.wallet.accounts.filter(
                    (account: IAccountState) =>
                        account.blockchain === props.selectedAccount.blockchain
                );
                setAccounts(hdAccounts);

                hdAccounts.map(account =>
                    this.props.getBalance(account.blockchain, account.address, undefined, true)
                );
            } catch (e) {
                // console.log(e);
            }
        })();
    }, [props.selectedAccount.blockchain]);

    const calculateBalance = (account: IAccountState) => {
        const tokenKeys = Object.keys(account.tokens);
        let balance = new BigNumber(0);
        tokenKeys.map(key => {
            const token = account.tokens[key];
            if (token.active) {
                if (token.type === TokenType.NATIVE) {
                    balance = balance.plus(token.balance?.value);
                } else {
                    const exchange =
                        props.exchangeRates[key][getBlockchain(account.blockchain).config.coin];
                    balance = balance.plus(token.balance?.value.multipliedBy(exchange));
                }
            }
        });
        return balance;
    };

    return (
        <View style={props.styles.container}>
            {accounts.map((account: IAccountState, index: number) => {
                const selected = props.selectedAccount.address === account.address;
                const blockchain = account.blockchain;

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
                                amount={calculateBalance(account)}
                                blockchain={blockchain}
                                token={getBlockchain(blockchain).config.coin}
                                tokenDecimals={
                                    getBlockchain(blockchain).config.tokens[
                                        getBlockchain(blockchain).config.coin
                                    ].decimals
                                }
                            />
                            <Amount
                                style={props.styles.secondAmountText}
                                amount={calculateBalance(account)}
                                blockchain={blockchain}
                                token={getBlockchain(blockchain).config.coin}
                                tokenDecimals={
                                    getBlockchain(blockchain).config.tokens[
                                        getBlockchain(blockchain).config.coin
                                    ].decimals
                                }
                                convert
                            />
                        </View>
                    </View>
                );
                return (
                    <ListAccount
                        key={index}
                        leftIcon={
                            blockchain === Blockchain.ETHEREUM
                                ? require('../../assets/images/png/eth.png')
                                : blockchain === Blockchain.ZILLIQA
                                ? require('../../assets/images/png/zil.png')
                                : undefined
                        }
                        rightIcon={selected ? 'check-1' : undefined}
                        label={label}
                        selected={selected}
                        onPress={() =>
                            props.switchSelectedAccount({
                                index: account.index,
                                blockchain
                            })
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
