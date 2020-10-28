import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Button, Text } from '../../../../library';
import { I3LinesCtaData, ICta } from '../../types';

interface ExternalProps {
    data: I3LinesCtaData[];
    cta: ICta;
}

const ThreeLinesCtaComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & ExternalProps
) => {
    const { data, cta, styles } = props;

    return (
        <View style={styles.container}>
            <View style={styles.generalFlex}>
                <Text style={styles.firstLineText}>{data[0].firstLine}</Text>
                <Text style={styles.secondLine}>{data[0].secondLine}</Text>
                <Text style={styles.thirdLine}>{data[0].thirdLine}</Text>
            </View>

            <View style={styles.actionButtonContainer}>
                <Button
                    primary={cta.buttonProps?.primary}
                    secondary={cta.buttonProps?.secondary}
                    disabled={cta.buttonProps?.disabled}
                    style={[
                        styles.actionButton,
                        {
                            backgroundColor: cta.buttonProps?.colors.bg,
                            borderColor: cta.buttonProps?.colors.bg
                        }
                    ]}
                >
                    <Text style={{ color: cta.buttonProps?.colors.label }}>{cta.label}</Text>
                </Button>
            </View>
        </View>
    );
};

export const ThreeLinesCta = smartConnect<ExternalProps>(ThreeLinesCtaComponent, [
    withTheme(stylesProvider)
]);
