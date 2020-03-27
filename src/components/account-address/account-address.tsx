import React from 'react';
import { View } from 'react-native';
import { Text } from '../../library';
import { IAccountState } from '../../redux/wallets/state';
import { ITheme } from '../../core/theme/itheme';
import stylesProvider from './styles';
import { withTheme } from '../../core/theme/with-theme';
import { formatAddress } from '../../core/utils/format-address';
import { Amount } from '../amount/amount';
import { ITokenState } from '../../redux/tokens/state';
import { getTokenConfig } from '../../redux/tokens/static-selectors';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IExternalProps {
    account: IAccountState;
    token: ITokenState;
}

export const AccountAddressComponent = (props: IProps & IExternalProps) => {
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
