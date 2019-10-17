import React from 'react';
import { View } from 'react-native';
import { Text, TextSmall } from '../../library/text';
import { IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../../core/blockchain/types';
import { BLOCKCHAIN_INFO } from '../../core/constants/blockchain';
import { Icon } from '../icon';
import Convert from '../convert/convert';

import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';

interface IProps {
    account: IAccountState;
    blockchain: Blockchain;
    styles: ReturnType<typeof stylesProvider>;
}

export const AccountCardComponent = (props: IProps) => {
    const styles = props.styles;
    return (
        <View style={styles.container}>
            <Icon name="money-wallet-1" size={25} style={styles.icon} />
            <View style={styles.accountInfoContainer}>
                <Text>
                    {props.account.balance} {BLOCKCHAIN_INFO[props.account.blockchain].coin}
                    <TextSmall>
                        {'  '} $
                        <Convert
                            from={BLOCKCHAIN_INFO[props.account.blockchain].coin}
                            to="USD"
                            style={{ fontSize: 12, marginLeft: 82 }}
                        >
                            {props.account.balance}
                        </Convert>
                    </TextSmall>
                </Text>
                <TextSmall>{props.account.address} </TextSmall>
            </View>
            <Icon name="arrow-right-1" size={25} style={styles.icon} />
        </View>
    );
};

export const AccountCard = withTheme(AccountCardComponent, stylesProvider);
