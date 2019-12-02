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
import { ICON_SIZE } from '../../styles/dimensions';
import { formatAddress } from '../../core/utils/format-address';

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
            <View style={styles.iconContainer}>
                <Icon name="money-wallet-1" size={ICON_SIZE} style={styles.icon} />
            </View>
            <View style={styles.accountInfoContainer}>
                <View style={styles.amountContainer}>
                    <Amount
                        style={styles.firstAmount}
                        amount={props.account.balance?.value}
                        blockchain={props.account.blockchain}
                    />
                    <Amount
                        style={styles.secondAmount}
                        amount={props.account.balance?.value}
                        blockchain={props.account.blockchain}
                        convert
                    />
                </View>
                <Text style={styles.address}>{formatAddress(props.account.address)} </Text>
            </View>
            <View style={styles.iconContainer}>
                <Icon name="arrow-right-1" size={ICON_SIZE} style={styles.icon} />
            </View>
        </TouchableOpacity>
    );
};

export const AccountCard = withTheme(stylesProvider)(AccountCardComponent);
