import React from 'react';
import { View } from 'react-native';
import { IAccountState } from '../../../../redux/wallets/state';
import { ITheme } from '../../../../core/theme/itheme';
import stylesProvider from './styles';
import { withTheme } from '../../../../core/theme/with-theme';
import { Amount } from '../../../../components/amount/amount';
import { Text } from '../../../../library';

export interface IProps {
    styles: ReturnType<typeof stylesProvider>;
    theme: ITheme;
}

export interface IExternalProps {
    account: IAccountState;
}

export const FeeComponent = (props: IProps & IExternalProps) => {
    const styles = props.styles;

    return (
        <View style={styles.container}>
            <Text style={styles.feeTitle}>Fee</Text>
            <Amount
                style={styles.fee}
                amount={props.account.balance?.value}
                blockchain={props.account.blockchain}
            />
            <View style={styles.containerFeeConverted}>
                <Text>~</Text>
                <Amount
                    style={styles.feeConverted}
                    amount={props.account.balance?.value}
                    blockchain={props.account.blockchain}
                    convert
                />
            </View>
        </View>
    );
};

export const Fee = withTheme(stylesProvider)(FeeComponent);
