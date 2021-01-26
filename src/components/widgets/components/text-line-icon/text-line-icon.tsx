import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, ITextLineIconData, ISmartScreenActions } from '../../types';
import { formatDataJSXElements, formatStyles } from '../../utils';
import Icon from '../../../icon/icon';
import { normalize } from '../../../../styles/dimensions';
import { Text } from '../../../../library';

interface IExternalProps {
    module: IScreenModule;
    actions: ISmartScreenActions;
    options?: {
        screenKey?: string;
        flowId?: string;
    };
}

const TextLineIconComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles } = props;
    const data = module.data as ITextLineIconData;

    const customIconStyle = module?.style && formatStyles(data.icon?.style);

    const moduleJSX = (
        <View style={[styles.row, formatStyles(module?.style)]}>
            <View style={[styles.row, formatStyles(data?.lineStyle)]}>
                <Text>{formatDataJSXElements(data.line, [styles.line])}</Text>
            </View>
            <Icon
                name={data.icon.value}
                size={(customIconStyle?.size as number) || normalize(18)}
                style={[styles.icon, customIconStyle]}
            />
        </View>
    );

    if (module?.cta) {
        return (
            <TouchableOpacity
                onPress={() => props.actions.handleCta(module.cta, props?.options)}
                activeOpacity={0.9}
            >
                {moduleJSX}
            </TouchableOpacity>
        );
    } else {
        return moduleJSX;
    }
};

export const TextLineIcon = smartConnect<IExternalProps>(TextLineIconComponent, [
    withTheme(stylesProvider)
]);
