import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { IAccountState } from '../../redux/wallets/state';
import { ITheme } from '../../core/theme/itheme';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { formatAddress } from '../../core/utils/format-address';
import { Amount } from '../amount/amount';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IExternalProps {
    account: IAccountState;
}

export const AccountAddressComponent = (props: IProps & IExternalProps) => {
    const styles = props.styles;

    return (
        <View style={styles.container}>
            <Text style={styles.address}>{formatAddress(props.account.address)}</Text>
            <View style={styles.balanceContainer}>
                <Amount
                    style={styles.balance}
                    amount={props.account.balance?.value}
                    blockchain={props.account.blockchain}
                />
                <Amount
                    style={styles.convert}
                    amount={props.account.balance?.value}
                    blockchain={props.account.blockchain}
                    convert
                />
            </View>
        </View>
    );
};

export const AccountAddress = withTheme(stylesProvider)(AccountAddressComponent);
