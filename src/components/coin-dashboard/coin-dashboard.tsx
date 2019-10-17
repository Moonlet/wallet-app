import React from 'react';
import { View, ScrollView } from 'react-native';
import { ConversionCard } from '../conversion-card/conversion-card';
import { AccountCard } from '../account-card/account-card';
import { IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import { BLOCKCHAIN_INFO } from '../../core/constants/blockchain';
import { Icon } from '../icon';

import styles from './styles';

interface IProps {
    blockchain: Blockchain;
    accounts?: IAccountState[];
}

const conversionCards = ['USD', 'BTC', 'ETH'];

export const CoinDashboard = (props: IProps) => (
    <View style={styles.container}>
        <View style={styles.exchangeCardContainer}>
            {conversionCards.map(
                (toCurrency, i) =>
                    BLOCKCHAIN_INFO[props.blockchain].coin !== toCurrency && (
                        <ConversionCard
                            key={i}
                            fromCurrency={BLOCKCHAIN_INFO[props.blockchain].coin}
                            toCurrency={toCurrency}
                        />
                    )
            )}
        </View>
        <View style={styles.addButton}>
            <Icon name="add" size={25} style={styles.icon} />
        </View>
        <ScrollView style={{ flex: 1, alignSelf: 'stretch' }}>
            {props.accounts &&
                props.accounts.map((account: IAccountState, i: number) => (
                    <AccountCard account={account} key={i} blockchain={props.blockchain} />
                ))}
        </ScrollView>
    </View>
);
