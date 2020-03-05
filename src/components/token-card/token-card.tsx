import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IAccountState } from '../../redux/wallets/state';
import { Icon } from '../icon';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { Amount } from '../amount/amount';
import { ITokenConfig } from '../../core/blockchain/types/token';
import { Blockchain } from '../../core/blockchain/types';
import FastImage from '../../core/utils/fast-image';

export interface IProps {
    blockchain: Blockchain;
    token: ITokenConfig;
    account: IAccountState;
    styles: ReturnType<typeof stylesProvider>;
    navigation: NavigationScreenProp<NavigationState, NavigationParams>;
    tokenIcon: any;
}

export const TokenCardComponent = (props: IProps) => {
    const styles = props.styles;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                props.navigation.navigate('Token', {
                    accountIndex: props.account.index,
                    blockchain: props.account.blockchain,
                    token: props.token
                });
            }}
        >
            <View style={styles.iconContainer}>
                <FastImage
                    source={props.token.icon}
                    style={styles.tokenIcon}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.accountInfoContainer}>
                <Amount
                    style={styles.firstAmount}
                    token={props.token.symbol}
                    tokenDecimals={props.token.decimals}
                    amount={props.token.balance?.value}
                    blockchain={props.blockchain}
                />
                <Amount
                    style={styles.secondAmount}
                    token={props.token.symbol}
                    tokenDecimals={props.token.decimals}
                    amount={props.token.balance?.value}
                    blockchain={props.blockchain}
                    convert
                />
            </View>
            <Icon name="chevron-right" size={18} style={styles.icon} />
        </TouchableOpacity>
    );
};

export const TokenCard = withTheme(stylesProvider)(TokenCardComponent);
