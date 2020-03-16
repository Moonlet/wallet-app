import React from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Text } from '../../../../library';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { BASE_DIMENSION } from '../../../../styles/dimensions';
import _ from 'lodash';

export interface IExternalProps {
    steps: { title: string; active?: boolean }[];
    selectStep: (index: number) => void;
}

export const HeaderStepByStepComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { steps, styles } = props;
    const [activeIndex, setActiveIndex] = React.useState<number>(undefined);

    React.useEffect(() => {
        const _activeIndex = _.findIndex(steps, ['active', true]);
        setActiveIndex(_activeIndex);
    });

    const renderStep = (index: number) => {
        const isCircleActive = index <= activeIndex;
        const isDividerSelected = index + 1 <= activeIndex;

        return (
            <View style={{ flexDirection: 'row' }} key={`step-${index}`}>
                <TouchableOpacity
                    onPress={() => props.selectStep(index)}
                    style={[styles.circle, isCircleActive && styles.circleSelected]}
                >
                    <Text style={[styles.number, isCircleActive && styles.numberSelected]}>
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
                {steps.map((__, index: number) => renderStep(index))}
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
