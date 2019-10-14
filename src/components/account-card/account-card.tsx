import React from 'react';
import { View } from 'react-native';
import { Text, TextSmall } from '../../library/text';
import { IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import { BLOCKCHAIN_COINS } from '../../core/constants';
import Convert from '../convert/convert';

import styles from './style.js';

interface IProps {
    account: IAccountState;
    blockchain: Blockchain;
}

const AccountCard = (props: IProps) => {
    return (
        <View style={styles.container}>
            <Text>LOGO</Text>
            <View style={styles.accountInfoContainer}>
                <Text>
                    {props.account.balance} {BLOCKCHAIN_COINS[props.account.blockchain]}
                    <TextSmall>
                        {'  '} $
                        <Convert
                            from={BLOCKCHAIN_COINS[props.account.blockchain]}
                            to="USD"
                            style={{ fontSize: 12, marginLeft: 82 }}
                        >
                            {props.account.balance}
                        </Convert>
                    </TextSmall>
                </Text>
                <TextSmall>{props.account.address} </TextSmall>
            </View>
            <Text>></Text>
        </View>
    );
};

export default AccountCard;
