import React from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export interface IExternalProps {
    steps: { title: string; selected?: boolean }[];
    selectPreviousStep: (index: number) => void;
}

export const HeaderStepByStepComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { steps, styles } = props;

    const renderStep = (step: any, index: number) => {
        const isSelected = steps[index + 1]?.selected || step?.selected || false;
        const isDividerSelected = steps[index + 2]?.selected || steps[index + 1]?.selected || false;
        // TODO: optimise this for more steps

        return (
            <View style={{ flexDirection: 'row' }} key={`step-${index}`}>
                <TouchableOpacity
                    onPress={() => props.selectPreviousStep(index)}
                    style={[styles.circle, (index === 0 || isSelected) && styles.circleSelected]}
                >
                    <Text
                        style={[
                            styles.number,
                            (index === 0 || isSelected) && styles.numberSelected
                        ]}
                    >
                        {index + 1}
                    </Text>
                </TouchableOpacity>

                {index !== steps.length - 1 && (
                    <View
                        style={[
                            {
                                width:
                                    Dimensions.get('window').width / steps.length -
                                    BASE_DIMENSION * steps.length
                            },
                            styles.divider,
                            isDividerSelected && styles.dividerSelected
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
                    <Text
                        key={`step-title-${index}`}
                        style={[
                            styles.text,
                            { marginLeft: index === 1 ? BASE_DIMENSION * 2 : BASE_DIMENSION } // TODO: optimise this for more steps
                        ]}
                    >
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
