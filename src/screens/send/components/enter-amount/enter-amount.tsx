import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { translate } from '../../../../core/i18n';
import { Amount } from '../../../../components/amount/amount';
import { Blockchain } from '../../../../core/blockchain/types';
import { ITokenConfig } from '../../../../core/blockchain/types/token';
import { convertAmount } from '../../../../core/utils/balance';

export interface IExternalProps {
    allBalance: string;
    amount: string;
    insufficientFunds: boolean;
    onAmountEnter: (amount: string) => void;
    blockchain: Blockchain;
    token: ITokenConfig;
    onAddAmount: (amount: string) => void;
    exchangeRates: any;
}

export const EnterAmountComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { amount, theme, styles, insufficientFunds } = props;
    const amountConverted = convertAmount(
        props.blockchain,
        props.exchangeRates,
        props.allBalance,
        props.token.symbol,
        props.token.symbol,
        props.token.decimals
    );

    return (
        <View style={styles.container}>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={theme.colors.textSecondary}
                    placeholder={translate('Send.amount')}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    selectionColor={theme.colors.accent}
                    value={amount}
                    onChangeText={value => props.onAmountEnter(value)}
                    keyboardType="decimal-pad"
                />
            </View>

            <View style={styles.buttonRightOptions}>
                <Text style={styles.displayError}>
                    {insufficientFunds ? translate('Send.insufficientFunds') : ''}
                </Text>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.textBalance}>{translate('Send.allBalance')}</Text>
                    <Amount
                        style={styles.allBalanceText}
                        token={props.token.symbol}
                        tokenDecimals={props.token.decimals}
                        amount={props.token.balance?.value}
                        blockchain={props.blockchain}
                    />
                </View>
            </View>

            <View style={styles.amountsContainer}>
                <TouchableOpacity
                    onPress={() => props.onAddAmount('0.1')}
                    style={[styles.addValueBox, { marginLeft: 0 }]}
                >
                    <Text style={styles.addValueText}>{`+0.1`}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.onAddAmount('1')} style={styles.addValueBox}>
                    <Text style={styles.addValueText}>{`+1`}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => props.onAddAmount('10')}
                    style={styles.addValueBox}
                >
                    <Text style={styles.addValueText}>{`+10`}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => props.onAddAmount('100')}
                    style={styles.addValueBox}
                >
                    <Text style={styles.addValueText}>{`+100`}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => props.onAmountEnter(amountConverted.dividedBy(2).toFixed())}
                    style={styles.addValueBox}
                >
                    <Text style={styles.addValueText}>{translate('App.labels.half')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => props.onAmountEnter(amountConverted.toFixed())}
                    style={[styles.addValueBox, { marginRight: 0 }]}
                >
                    <Text style={styles.addValueText}>{translate('App.labels.all')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const EnterAmount = smartConnect<IExternalProps>(
    withTheme(stylesProvider)(EnterAmountComponent)
);
