import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, TextSmall } from '../../library/text';
import ConversionCard from '../conversion-card/conversion-card';
import AccountCard from '../account-card/account-card';
import { IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import { BLOCKCHAIN_COINS } from '../../core/constants';

import styles from './style.js';

interface IProps {
    blockchain: Blockchain;
    accounts?: IAccountState[];
}

const conversionCards = ['USD', 'BTC', 'ETH'];

const CoinHoldings = (props: IProps) => (
    <View style={styles.container}>
        <View style={styles.exchangeCardContainer}>
            {conversionCards.map(
                (toCurrency, i) =>
                    BLOCKCHAIN_COINS[props.blockchain] !== toCurrency && (
                        <ConversionCard
                            key={i}
                            fromCurrency={BLOCKCHAIN_COINS[props.blockchain]}
                            toCurrency={toCurrency}
                            change={0.0032}
                        />
                    )
            )}
        </View>
        <View style={{ height: 42 }}>
            <Text>Add account</Text>
        </View>
        <ScrollView style={{ flex: 1, alignSelf: 'stretch' }}>
            {props.accounts &&
                props.accounts.map((account: IAccountState, i: number) => (
                    <AccountCard account={account} key={i} blockchain={props.blockchain} />
                ))}
        </ScrollView>
    </View>
);

export default CoinHoldings;
