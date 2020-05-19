import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { formatAddress } from '../../core/utils/format-address';
import { Amount } from '../amount/amount';
import { getTokenConfig } from '../../redux/tokens/static-selectors';

export interface IExternalProps {
    account: IAccountState;
    token: ITokenState;
}

export const AccountAddressComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const styles = props.styles;

    const tokenConfig = getTokenConfig(props.account.blockchain, props.token.symbol);

    return (
        <View style={styles.container}>
            <Text style={styles.address}>
                {formatAddress(props.account.address, props.account.blockchain)}
            </Text>
            <View style={styles.balanceContainer}>
                <Amount
                    style={styles.balance}
                    amount={props.token.balance?.value}
                    blockchain={props.account.blockchain}
                    token={props.token.symbol}
                    tokenDecimals={tokenConfig.decimals}
                />
                <Amount
                    style={styles.convert}
                    amount={props.token.balance?.value}
                    blockchain={props.account.blockchain}
                    token={props.token.symbol}
                    tokenDecimals={tokenConfig.decimals}
                    convert
                />
            </View>
        </View>
    );
};

export const AccountAddress = withTheme(stylesProvider)(AccountAddressComponent);
