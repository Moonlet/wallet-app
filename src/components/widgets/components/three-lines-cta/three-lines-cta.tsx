import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { Button, Text } from '../../../../library';
import { I3LinesCtaData, ICta, IScreenModule, ISmartScreenActions } from '../../types';
import { formatDataJSXElements, formatStyles } from '../../utils';

interface IExternalProps {
    module: IScreenModule;
    actions: ISmartScreenActions;
}

const ThreeLinesCtaComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { actions, module, styles } = props;
    const data = module.data as I3LinesCtaData;
    const cta = module.cta as ICta;

    const handleOnPress = () => actions.handleCta(cta);

    return (
        <View style={[styles.container, module?.style && formatStyles(module.style)]}>
            <View style={styles.generalFlex}>
                <View style={styles.row}>
                    {formatDataJSXElements(data.firstLine, styles.firstLineText)}
                </View>
                <View style={styles.row}>
                    {formatDataJSXElements(data.secondLine, styles.secondLine)}
                </View>
                <View style={styles.row}>
                    {formatDataJSXElements(data.thirdLine, styles.thirdLine)}
                </View>
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
                    onPress={handleOnPress}
                >
                    <Text style={{ color: cta.buttonProps?.colors.label }}>{cta.label}</Text>
                </Button>
            </View>
        </View>
    );
};

export const ThreeLinesCta = smartConnect<IExternalProps>(ThreeLinesCtaComponent, [
    withTheme(stylesProvider)
]);
