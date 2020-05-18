import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../core/theme/with-theme';
import { Text } from '../../../library';
import { smartConnect } from '../../../core/utils/smart-connect';

export interface IExternalProps {
    label: string; // 'Send' | 'Stake' | 'Unstake' | 'Revote' | ...
    labelColor?: string;
    action: string; // 'to' | 'from' | 'for' | ...
    value: string;
    secondLabel?: {
        label: string; // 'to' | 'from' | 'for' | ...
        value: string;
    };
}

export const PrimaryCtaFieldComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { labelColor, styles, secondLabel } = props;

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={[
                        styles.sendText,
                        { color: labelColor ? labelColor : props.theme.colors.accent }
                    ]}
                >
                    {props.label}
                </Text>
                <Text style={[styles.toText, { textTransform: 'lowercase' }]}>{props.action}</Text>
                <Text style={styles.defaultText}>
                    {props.value !== '' ? props.value : '___...___'}
                </Text>
            </View>

            {secondLabel && (
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.toText, { textTransform: 'lowercase' }]}>
                        {secondLabel.label}
                    </Text>
                    <Text style={styles.defaultText}>{secondLabel.value}</Text>
                </View>
            )}
        </View>
    );
};

export const PrimaryCtaField = smartConnect<IExternalProps>(PrimaryCtaFieldComponent, [
    withTheme(stylesProvider)
]);
