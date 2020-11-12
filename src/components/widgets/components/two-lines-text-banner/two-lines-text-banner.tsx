import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { I2LinesTextBannerData, IScreenModule } from '../../types';
import { normalize } from '../../../../styles/dimensions';
import Icon from '../../../icon/icon';
import { formatDataJSXElements, formatStyles } from '../../utils';

interface IExternalProps {
    module: IScreenModule;
    actions: any;
}

const TwoLinesStakeBannerComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles, theme } = props;
    const data = module.data as I2LinesTextBannerData;

    const moduleJSX = (
        <View
            style={[
                styles.container,
                { backgroundColor: data?.backgroundColor || theme.colors.cardBackground },
                module?.style && formatStyles(module.style)
            ]}
        >
            <View style={styles.textContainer}>
                <View style={styles.row}>
                    {formatDataJSXElements(data.firstLine, styles.mainText)}
                </View>
                <View style={styles.row}>
                    {formatDataJSXElements(data.secondLine, styles.secondaryText)}
                </View>
            </View>

            {data?.icon?.value && (
                <Icon name={data.icon.value} size={normalize(50)} style={styles.icon} />
            )}
        </View>
    );

    if (module?.cta) {
        return (
            <TouchableOpacity
                onPress={() => props.actions.handleCta(module.cta)}
                activeOpacity={0.9}
            >
                {moduleJSX}
            </TouchableOpacity>
        );
    } else {
        return moduleJSX;
    }
};

export const TwoLinesStakeBanner = smartConnect<IExternalProps>(TwoLinesStakeBannerComponent, [
    withTheme(stylesProvider)
]);
