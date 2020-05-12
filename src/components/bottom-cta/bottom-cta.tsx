import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Text, Button } from '../../library';
import { smartConnect } from '../../core/utils/smart-connect';
import { Amount } from '../amount/amount';
import { normalize, BASE_DIMENSION } from '../../styles/dimensions';
import { IAccountState } from '../../redux/wallets/state';
import { ITokenConfigState } from '../../redux/tokens/state';
import BigNumber from 'bignumber.js';

export interface IExternalProps {
    options: {
        label: string; // 'Send' | 'Stake' | 'Unstake' | 'Revote' | ...
        labelColor?: string;
        action: string; // 'to' | 'from' | 'for' | ...
        value: string;
        secondLabel?: {
            label: string; // 'to' | 'from' | 'for' | ...
            value: string;
        };
        amountVisible?: boolean;
        tokenConfig: ITokenConfigState;
        stdAmount: BigNumber;
        account: IAccountState;
        extraAmountConvertedLabel?: string; // ex: Validator
    };
    button: {
        label: string;
        onPress: () => void;
        disabled: boolean;
        // style?: 'primary' | 'secondary' | 'disabled' | 'disabledSecondary';
    };
}

export const BottomCtaComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { options, styles } = props;

    return (
        <View style={styles.bottomWrapper}>
            <View style={styles.bottomDivider} />

            <View style={styles.bottomContainer}>
                <View style={styles.bottomTextContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={[
                                styles.bottomSendText,
                                {
                                    color: options?.labelColor
                                        ? options.labelColor
                                        : props.theme.colors.accent
                                }
                            ]}
                        >
                            {options.label}
                        </Text>
                        <Text style={[styles.bottomToText, { textTransform: 'lowercase' }]}>
                            {options.action}
                        </Text>
                        <Text style={styles.bottomDefaultText}>
                            {options.value !== '' ? options.value : '___...___'}
                        </Text>
                    </View>

                    {options?.secondLabel && (
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.bottomToText, { textTransform: 'lowercase' }]}>
                                {options.secondLabel.label}
                            </Text>
                            <Text style={styles.bottomDefaultText}>
                                {options.secondLabel.value}
                            </Text>
                        </View>
                    )}

                    {options.amountVisible && (
                        <View>
                            {options.stdAmount.toString() === '0' ? (
                                <Text style={styles.bottomDefaultText}>
                                    {`_.___ ${options.tokenConfig.symbol}`}
                                </Text>
                            ) : (
                                <Amount
                                    style={styles.bottomDefaultText}
                                    token={options.tokenConfig.symbol}
                                    tokenDecimals={options.tokenConfig.decimals}
                                    amount={options.stdAmount.toString()}
                                    blockchain={options.account.blockchain}
                                />
                            )}

                            <View style={{ flexDirection: 'row' }}>
                                <Amount
                                    style={styles.bottomAmountText}
                                    token={options.tokenConfig.symbol}
                                    tokenDecimals={options.tokenConfig.decimals}
                                    amount={options.stdAmount.toString()}
                                    blockchain={options.account.blockchain}
                                    convert
                                />
                                {props.options?.extraAmountConvertedLabel && (
                                    <Text
                                        style={[
                                            styles.bottomAmountText,
                                            { marginLeft: BASE_DIMENSION / 2 }
                                        ]}
                                    >
                                        {`/ ${props.options?.extraAmountConvertedLabel}`}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        style={{ width: normalize(140) }}
                        primary
                        disabled={props.button.disabled}
                        onPress={() => props.button.onPress()}
                    >
                        {props.button.label}
                    </Button>
                </View>
            </View>
        </View>
    );
};

export const BottomCta = smartConnect<IExternalProps>(
    withTheme(stylesProvider)(BottomCtaComponent)
);
