import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Amount } from '../../../../components/amount/amount';
import { Text } from '../../../../library';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../../core/blockchain/types';

export interface IExternalProps {
    amount: BigNumber;
    blockchain: Blockchain;
    title: string;
    selected?: boolean;
    onSelect: (title: string) => any;
}

export const FeePresetComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const styles = props.styles;

    return (
        <TouchableOpacity
            testID="advanced-fees"
            onPress={props.onSelect(props.title)}
            style={props.selected ? [styles.container, styles.containerSelected] : styles.container}
        >
            <Text style={styles.feeTitle}>{props.title}</Text>
            <Amount style={styles.fee} amount={props.amount} blockchain={props.blockchain} />
            <View style={styles.containerFeeConverted}>
                <Text style={styles.feeConverted}>~</Text>
                <Amount
                    style={styles.feeConverted}
                    amount={props.amount}
                    blockchain={props.blockchain}
                    convert
                />
            </View>
        </TouchableOpacity>
    );
};

export const FeePreset = withTheme(stylesProvider)(FeePresetComponent);
