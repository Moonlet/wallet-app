import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, IThreeLinesIconData } from '../../types';
import { formatDataJSXElements, formatStyles } from '../../utils';
import { SmartImage } from '../../../../library/image/smart-image';

interface IExternalProps {
    module: IScreenModule;
}

const ThreeLinesIconComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles } = props;
    const data = module.data as IThreeLinesIconData;

    return (
        <View style={[styles.container, module?.style && formatStyles(module.style)]}>
            <SmartImage
                source={{ uri: data.icon.url }}
                style={[styles.imageBaseStyle, data.icon?.style && formatStyles(data.icon.style)]}
            />

            <View>
                <View style={styles.row}>
                    {formatDataJSXElements(data.firstLine, styles.lineText)}
                </View>
                <View style={styles.row}>
                    {formatDataJSXElements(data.secondLine, styles.lineText)}
                </View>
                <View style={styles.row}>
                    {formatDataJSXElements(data.thirdLine, styles.lineText)}
                </View>
            </View>
        </View>
    );
};

export const ThreeLinesIcon = smartConnect<IExternalProps>(ThreeLinesIconComponent, [
    withTheme(stylesProvider)
]);
