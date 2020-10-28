import React from 'react';
import { View, Text } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Button } from '../../../../library';

export interface I3LinesCtaData {
    firstLine: string;
    secondLine: string;
    thirdLine: string;
}

interface ExternalProps {
    cta: any;
    data: I3LinesCtaData[];
}

export const ThreeLinesCtaComponent: React.FC<IThemeProps<ReturnType<typeof stylesProvider>> &
    ExternalProps> = ({ data, cta, styles }) => {
    return (
        <View style={styles.container}>
            <View style={styles.generalFlex}>
                <Text style={styles.firstLineText}>{data[0].firstLine}</Text>
                <Text style={styles.secondLine}>{data[0].secondLine}</Text>
                <Text style={styles.thirdLine}>{data[0].thirdLine}</Text>
            </View>
            <View style={styles.actionButtonContainer}>
                <Button
                    style={[{ backgroundColor: cta.buttonProps.colors.bg }, styles.actionButton]}
                    primary={cta.buttonProps.primary}
                >
                    <Text
                        style={[{ color: cta.buttonProps.colors.label }, styles.actionButtonText]}
                    >
                        {cta.label}
                    </Text>
                </Button>
            </View>
        </View>
    );
};

export const ThreeLinesCta = smartConnect<ExternalProps>(ThreeLinesCtaComponent, [
    withTheme(stylesProvider)
]);
