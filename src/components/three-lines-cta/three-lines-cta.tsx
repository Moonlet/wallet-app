import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme } from '../../core/theme/with-theme';

export interface I3LinesCtaData {
    firstLine: string;
    secondLine: string;
    thirdLine: string;
}

interface ExternalProps {
    cta: any;
    data: I3LinesCtaData[];
}

interface Props {
    styles: ReturnType<typeof stylesProvider>;
}

export const ThreeLinesCtaComponent: React.FC<Props & ExternalProps> = ({ data, cta, styles }) => {
    return (
        <View style={styles.container}>
            <View style={styles.generalFlex}>
                <Text style={styles.firstLineText}>{data[0].firstLine}</Text>
                <Text style={styles.secondLine}>{data[0].secondLine}</Text>
                <Text style={styles.thirdLine}>{data[0].thirdLine}</Text>
            </View>
            <View style={styles.actionButtonContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: cta.buttonProps.colors.bg }]}
                >
                    <Text style={{ color: cta.buttonProps.colors.label }}>{cta.label}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export const ThreeLinesCta = smartConnect<ExternalProps>(ThreeLinesCtaComponent, [
    withTheme(stylesProvider)
]);
