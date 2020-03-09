import React from 'react';
import { View, Dimensions } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export interface IExternalProps {
    steps: any;
}

export const HeaderStepByStepComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { styles } = props;
    const steps = [
        { title: `Add\naddress` },
        { title: `Enter\namount`, selected: false },
        { title: `Confirm\ntransaction`, selected: false }
    ];

    const renderStep = (step: any, index: number) => {
        const isSelected = step?.selected || false;

        return (
            <View style={{ flexDirection: 'row' }} key={`step-${index}`}>
                <View style={[styles.circle, (index === 0 || isSelected) && styles.circleSelected]}>
                    <Text
                        style={[
                            styles.number,
                            (index === 0 || isSelected) && styles.numberSelected
                        ]}
                    >
                        {index + 1}
                    </Text>
                </View>

                {index !== steps.length - 1 && (
                    <View
                        style={[
                            {
                                width:
                                    Dimensions.get('window').width / steps.length -
                                    BASE_DIMENSION * steps.length
                            },
                            styles.divider,
                            isSelected && styles.dividerSelected
                        ]}
                    />
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                {steps.map((step: any, index: number) => renderStep(step, index))}
            </View>

            <View style={styles.headerDescription}>
                {steps.map((step: any, index: number) => (
                    <Text key={`step-title-${index}`} style={styles.text}>
                        {step.title}
                    </Text>
                ))}
            </View>
        </View>
    );
};

export const HeaderStepByStep = smartConnect<IExternalProps>(
    withTheme(stylesProvider)(HeaderStepByStepComponent)
);
