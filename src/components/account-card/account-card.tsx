import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../../library';
import { IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import { BLOCKCHAIN_INFO } from '../../core/constants/blockchain';
import { Icon } from '../icon';
import { Convert } from '../convert/convert';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';

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
                props.navigation.navigate('Account');
            }}
        >
            <Icon name="money-wallet-1" size={25} style={styles.icon} />
            <View style={styles.accountInfoContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text format={{ currency: BLOCKCHAIN_INFO[props.account.blockchain].coin }}>
                        {props.account.balance}
                    </Text>
                    <Text small>
                        {'  '} $
                        <Convert
                            from={BLOCKCHAIN_INFO[props.account.blockchain].coin}
                            to="USD"
                            style={{ fontSize: 12, marginLeft: 82 }}
                            amount={props.account.balance.value}
                        />
                    </Text>
                </View>
                <Text small>{props.account.address} </Text>
            </View>
            <Icon name="arrow-right-1" size={25} style={styles.icon} />
        </TouchableOpacity>
    );
};

export const AccountCard = withTheme(stylesProvider)(AccountCardComponent);
