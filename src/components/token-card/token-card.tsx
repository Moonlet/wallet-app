import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IToken, IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import { Icon } from '../icon';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Amount } from '../amount/amount';
import { ICON_SIZE } from '../../styles/dimensions';

export interface IProps {
    token: IToken;
    account: IAccountState;
    blockchain: Blockchain;
    styles: ReturnType<typeof stylesProvider>;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export const TokenCardComponent = (props: IProps) => {
    const styles = props.styles;
    return (
        <TouchableOpacity
            testID="account-card"
            style={styles.container}
            onPress={() =>
                props.navigation.navigate('Account', {
                    accountIndex: props.account.index,
                    blockchain: props.account.blockchain
                })
            }
        >
            <View style={styles.iconContainer}>
                <Icon name="money-wallet-1" size={ICON_SIZE} style={styles.icon} />
            </View>
            <View style={styles.accountInfoContainer}>
                <Amount
                    style={styles.firstAmount}
                    amount={props.account.balance?.value}
                    blockchain={props.account.blockchain}
                />
                <Amount
                    style={styles.secondAmount}
                    amount={props.token.balance?.value}
                    blockchain={props.blockchain}
                    convert
                />
            </View>
            <View style={styles.iconContainer}>
                <Icon name="chevron-right" size={18} style={styles.icon} />
            </View>
        </TouchableOpacity>
    );
};

export const TokenCard = withTheme(stylesProvider)(TokenCardComponent);
