import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { translate } from '../../../../core/i18n';
import { Amount } from '../../../../components/amount/amount';
import BigNumber from 'bignumber.js';
import { ITokenState, IAccountState } from '../../../../redux/wallets/state';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { getInputAmountToStd } from '../../../../core/utils/available-funds';

export interface IExternalProps {
    availableAmount: string;
    account: IAccountState;
    token: ITokenState;
    value: string;
    onChange: (value: string) => any;
    insufficientFunds: boolean;
}

export const EnterAmountComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { value, theme, styles, insufficientFunds, onChange, availableAmount } = props;

    const onAddAmount = (amount: string) => {
        let valueState = value;
        if (valueState === '') valueState = '0';

        const addedAmount = new BigNumber(valueState).plus(new BigNumber(amount));
        onChange(addedAmount.toFixed());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.receipientLabel}>
                {value !== '' ? `${translate('Send.amount')} (${props.token.symbol})` : ' '}
            </Text>

            <View style={styles.inputBox}>
                <TextInput
                    style={styles.inputText}
                    placeholderTextColor={theme.colors.textSecondary}
                    placeholder={translate('Send.amount')}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    selectionColor={theme.colors.accent}
                    value={value}
                    onChangeText={text => props.onChange(text)}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                    // TODO: maxLength - max 8 decimals: 0.00000000
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
                        tokenDecimals={
                            getTokenConfig(props.account.blockchain, props.token.symbol).decimals
                        }
                        amount={getInputAmountToStd(
                            props.account,
                            props.token,
                            availableAmount
                        ).toString()}
                        blockchain={props.account.blockchain}
                    />
                </View>
            </View>

            <View style={styles.amountsContainer}>
                <TouchableOpacity
                    onPress={() => onAddAmount('0.1')}
                    style={[styles.addValueBox, { marginLeft: 0 }]}
                >
                    <Text style={styles.addValueText}>{`+0.1`}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onAddAmount('1')} style={styles.addValueBox}>
                    <Text style={styles.addValueText}>{`+1`}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onAddAmount('10')} style={styles.addValueBox}>
                    <Text style={styles.addValueText}>{`+10`}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => onAddAmount('100')} style={styles.addValueBox}>
                    <Text style={styles.addValueText}>{`+100`}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => props.onChange((Number(availableAmount) / 2).toString())}
                    style={styles.addValueBox}
                >
                    <Text style={styles.addValueText}>{translate('App.labels.half')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => props.onChange(availableAmount)}
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
