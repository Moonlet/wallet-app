import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, IIconTwoLinesData } from '../../types';
import { formatDataJSXElements, formatStyles } from '../../utils';
import { SmartImage } from '../../../../library/image/smart-image';

interface IExternalProps {
    module: IScreenModule;
}

const IconTwoLinesComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles } = props;
    const data = module.data as IIconTwoLinesData;

    return (
        <View style={styles.container}>
            {data?.icon && (
                <SmartImage
                    source={{ uri: data.icon.url }}
                    style={[
                        styles.imageBaseStyle,
                        data?.icon?.style && formatStyles(data.icon.style)
                    ]}
                />
            )}

            <View style={{ flexDirection: 'column' }}>
                <View style={styles.row}>
                    {formatDataJSXElements(data.firstLine, [styles.lineText, styles.marginBottom])}
                </View>
                <View style={styles.row}>
                    {formatDataJSXElements(data.secondLine, styles.lineText)}
                </View>
            </View>
        </View>
    );
};

export const IconTwoLines = smartConnect<IExternalProps>(IconTwoLinesComponent, [
    withTheme(stylesProvider)
]);
