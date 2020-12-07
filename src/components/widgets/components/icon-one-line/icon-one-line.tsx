import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, IIconOneLineData } from '../../types';
import { formatDataJSXElements, formatStyles } from '../../utils';
import Icon from '../../../icon/icon';
import { normalize } from '../../../../styles/dimensions';

interface IExternalProps {
    module: IScreenModule;
}

const IconOneLineComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles } = props;
    const data = module.data as IIconOneLineData;

    const customIconStyle = module?.style && formatStyles(data.icon?.style);

    return (
        <View style={[styles.row, formatStyles(module?.style)]}>
            <Icon
                name={data.icon.value}
                size={(customIconStyle?.size as number) || normalize(18)}
                style={[styles.icon, customIconStyle]}
            />
            <View style={styles.row}>{formatDataJSXElements(data.line, [styles.line])}</View>
        </View>
    );
};

export const IconOneLine = smartConnect<IExternalProps>(IconOneLineComponent, [
    withTheme(stylesProvider)
]);
