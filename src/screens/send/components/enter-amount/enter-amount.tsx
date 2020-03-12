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

export interface IExternalProps {
    amount: string;
    insufficientFunds: boolean;
    blockchain: Blockchain;
    token: ITokenConfig;
    onInputEnter: (amount: string) => void;
    onAddAmount: (amount: string) => void;
    onAddAllBalance: () => void;
    onAddHalfBalance: () => void;
}

export const EnterAmountComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { amount, theme, styles, insufficientFunds } = props;

    return (
        <View style={styles.container}>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.inputText}
                    placeholderTextColor={theme.colors.textSecondary}
                    placeholder={translate('Send.amount')}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    selectionColor={theme.colors.accent}
                    value={amount}
                    onChangeText={value => props.onInputEnter(value)}
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
                    onPress={() => props.onAddHalfBalance()}
                    style={styles.addValueBox}
                >
                    <Text style={styles.addValueText}>{translate('App.labels.half')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => props.onAddAllBalance()}
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
