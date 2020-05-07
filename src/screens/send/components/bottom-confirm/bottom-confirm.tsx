import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Text, Button } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { translate } from '../../../../core/i18n';
import { formatAddress } from '../../../../core/utils/format-address';
import { Amount } from '../../../../components/amount/amount';
import { normalize } from '../../../../styles/dimensions';
import { IFeeOptions } from '../../../../core/blockchain/types';
import { IAccountState } from '../../../../redux/wallets/state';
import { ITokenConfigState } from '../../../../redux/tokens/state';
import BigNumber from 'bignumber.js';
import _ from 'lodash';

export interface IHeaderStep {
    step: number;
    title: string;
    active: boolean;
}

export interface IExternalProps {
    toAddress: string;
    activeIndex: number;
    amount: string;
    account: IAccountState;
    feeOptions: IFeeOptions;
    insufficientFunds?: boolean;
    insufficientFundsFees?: boolean;
    headerSteps?: IHeaderStep[];
    tokenConfig: ITokenConfigState;
    stdAmount: BigNumber;
    confirmPayment: () => void;
    setHeaderSetps?: (steps: IHeaderStep[]) => void;
}

export const BottomConfirmComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { styles } = props;

    let disableButton: boolean; // keep as state
    switch (props.activeIndex) {
        case 0:
            // Add address
            if (props.toAddress === '') disableButton = true;
            break;
        case 1:
            // Enter amount
            if (
                props.amount === '' ||
                props.insufficientFunds ||
                props.insufficientFundsFees ||
                isNaN(Number(props.feeOptions?.gasLimit)) === true ||
                isNaN(Number(props.feeOptions?.gasPrice))
            )
                disableButton = true;
            break;
        case 2:
            // Confirm transaction
            disableButton = false;
            break;
        default:
            disableButton = true;
            break;
    }

    return (
        <View style={styles.bottomWrapper}>
            <View style={styles.bottomDivider} />

            <View style={styles.bottomContainer}>
                <View style={styles.bottomTextContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.bottomSendText}>{translate('App.labels.send')}</Text>
                        <Text style={[styles.bottomToText, { textTransform: 'lowercase' }]}>
                            {translate('App.labels.to')}
                        </Text>
                        <Text style={styles.bottomDefaultText}>
                            {props.toAddress !== ''
                                ? formatAddress(props.toAddress, props.account.blockchain)
                                : '___...___'}
                        </Text>
                    </View>

                    {(props.activeIndex === 1 || props.activeIndex === 2) && (
                        <React.Fragment>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="middle"
                                style={styles.bottomDefaultText}
                            >
                                {props.amount === ''
                                    ? `_.___ ${props.tokenConfig.symbol}`
                                    : `${props.amount} ${props.tokenConfig.symbol}`}
                            </Text>

                            <Amount
                                style={styles.bottomAmountText}
                                token={props.tokenConfig.symbol}
                                tokenDecimals={props.tokenConfig.decimals}
                                amount={props.stdAmount.toString()}
                                blockchain={props.account.blockchain}
                                convert
                            />
                        </React.Fragment>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        style={{ width: normalize(140) }}
                        primary
                        disabled={disableButton}
                        onPress={() => {
                            if (props.activeIndex === 2) {
                                props.confirmPayment();
                            } else {
                                const steps = props.headerSteps;

                                steps[props.activeIndex].active = false;
                                steps[props.activeIndex + 1].active = true;

                                props.setHeaderSetps(steps);
                            }
                        }}
                    >
                        {props.activeIndex === props.headerSteps.length - 1
                            ? translate('App.labels.confirm')
                            : translate('App.labels.next')}
                    </Button>
                </View>
            </View>
        </View>
    );
};

export const BottomConfirm = smartConnect<IExternalProps>(
    withTheme(stylesProvider)(BottomConfirmComponent)
);
