import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { IAccountState } from '../../redux/wallets/state';
import { Convert } from '../convert/convert';
import { ITheme } from '../../core/theme/itheme';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { BLOCKCHAIN_INFO } from '../../core/blockchain/blockchain-factory';
import { formatAddress } from '../../core/utils/format-address';
import { formatAmountFromAccount, amountFromAccount } from '../../core/utils/format-amount';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IExternalProps {
    account: IAccountState;
}

export const AccountAddressComponent = (props: IProps & IExternalProps) => {
    const styles = props.styles;
    const coin = BLOCKCHAIN_INFO[props.account.blockchain].coin;

    return (
        <View style={styles.container}>
            <Text style={styles.address}>{formatAddress(props.account.address)}</Text>
            <View style={styles.balanceContainer}>
                <Text style={styles.balance} format={{ currency: coin }}>
                    {formatAmountFromAccount(props.account)}
                </Text>
                <Text style={styles.convert}>
                    {'  '} $
                    <Convert
                        from={BLOCKCHAIN_INFO[props.account.blockchain].coin}
                        to="USD"
                        style={{
                            fontSize: props.theme.fontSize.large,
                            color: props.theme.colors.textSecondary
                        }}
                        amount={amountFromAccount(props.account)}
                    />
                </Text>
            </View>
        </View>
    );
};

export const AccountAddress = withTheme(stylesProvider)(AccountAddressComponent);
