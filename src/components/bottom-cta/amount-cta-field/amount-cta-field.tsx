import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Text } from '../../../library';
import { smartConnect } from '../../../core/utils/smart-connect';
import { Amount } from '../../amount/amount';
import { BASE_DIMENSION } from '../../../styles/dimensions';
import { IAccountState } from '../../../redux/wallets/state';
import { ITokenConfigState } from '../../../redux/tokens/state';
import BigNumber from 'bignumber.js';

export interface IExternalProps {
    tokenConfig: ITokenConfigState;
    stdAmount: BigNumber;
    account: IAccountState;
    extraAmountConvertedLabel?: string; // ex: Validator
}

export const AmountCtaFieldComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { account, stdAmount, tokenConfig, styles, extraAmountConvertedLabel } = props;

    return (
        <View>
            {stdAmount.toString() === '0' ? (
                <Text style={styles.defaultText}>{`_.___ ${tokenConfig.symbol}`}</Text>
            ) : (
                <Amount
                    style={styles.defaultText}
                    token={tokenConfig.symbol}
                    tokenDecimals={tokenConfig.decimals}
                    amount={stdAmount.toFixed()}
                    blockchain={account.blockchain}
                    uiDecimals={tokenConfig.decimals}
                />
            )}

            <View style={{ flexDirection: 'row' }}>
                <Amount
                    style={styles.amountText}
                    token={tokenConfig.symbol}
                    tokenDecimals={tokenConfig.decimals}
                    amount={stdAmount.toFixed()}
                    blockchain={account.blockchain}
                    convert
                    uiDecimals={tokenConfig.decimals}
                />
                {extraAmountConvertedLabel && (
                    <Text style={[styles.amountText, { marginLeft: BASE_DIMENSION / 2 }]}>
                        {`/ ${extraAmountConvertedLabel}`}
                    </Text>
                )}
            </View>
        </View>
    );
};

export const AmountCtaField = smartConnect<IExternalProps>(AmountCtaFieldComponent, [
    withTheme(stylesProvider)
]);
