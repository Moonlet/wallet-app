import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../library';
import { IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import { Icon } from '../icon';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Amount } from '../amount/amount';

export interface IProps {
    account: IAccountState;
    blockchain: Blockchain;
    styles: ReturnType<typeof stylesProvider>;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export const AccountCardComponent = (props: IProps) => {
    const styles = props.styles;
    return (
        <TouchableOpacity
            testID="account-card"
            style={styles.container}
            onPress={() => {
                props.navigation.navigate('Account', {
                    accountIndex: props.account.index,
                    blockchain: props.account.blockchain
                });
            }}
        >
            <Icon name="money-wallet-1" size={25} style={styles.icon} />
            <View style={styles.accountInfoContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Amount
                        amount={props.account.balance?.value}
                        blockchain={props.account.blockchain}
                    />
                    <Amount
                        style={{ fontSize: 12, marginLeft: 8 }}
                        amount={props.account.balance?.value}
                        blockchain={props.account.blockchain}
                        convert
                    />
                </View>
                <Text small>{props.account.address} </Text>
            </View>
            <Icon name="arrow-right-1" size={25} style={styles.icon} />
        </TouchableOpacity>
    );
};

export const AccountCard = withTheme(stylesProvider)(AccountCardComponent);
