import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { IAccountState } from '../../redux/wallets/state';
import { ITheme } from '../../core/theme/itheme';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { formatAddress } from '../../core/utils/format-address';
import { Amount } from '../amount/amount';
import { ITokenConfig } from '../../core/blockchain/types/token';
import { Blockchain } from '../../core/blockchain/types';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IExternalProps {
    account: IAccountState;
    token: ITokenConfig;
}

export const AccountAddressComponent = (props: IProps & IExternalProps) => {
    const styles = props.styles;

    return (
        <View style={styles.container}>
            <Text style={styles.address}>
                {props.account.blockchain === Blockchain.NEAR
                    ? props.account.address
                    : formatAddress(props.account.address)}
            </Text>
            <View style={styles.balanceContainer}>
                <Amount
                    style={styles.balance}
                    amount={props.token.balance?.value}
                    blockchain={props.account.blockchain}
                    token={props.token.symbol}
                    tokenDecimals={props.token.decimals}
                />
                <Amount
                    style={styles.convert}
                    amount={props.token.balance?.value}
                    blockchain={props.account.blockchain}
                    token={props.token.symbol}
                    tokenDecimals={props.token.decimals}
                    convert
                />
            </View>
        </View>
    );
};

export const AccountAddress = withTheme(stylesProvider)(AccountAddressComponent);
