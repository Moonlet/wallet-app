import React from 'react';
import { TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, IIconData, ISmartScreenActions } from '../../types';
import { formatStyles } from '../../utils';
import Icon from '../../../icon/icon';
import { normalize } from '../../../../styles/dimensions';

interface IExternalProps {
    module: IScreenModule;
    actions: ISmartScreenActions;
    options?: {
        screenKey?: string;
        flowId?: string;
    };
}

const IconModuleComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles } = props;
    const data = module.data as IIconData;

    const customStyle = formatStyles(module?.style);

    const moduleJSX = (
        <Icon
            name={data.icon}
            size={(customStyle?.size as number) || normalize(18)}
            style={[styles.icon, customStyle]}
        />
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

export const IconModule = smartConnect<IExternalProps>(IconModuleComponent, [
    withTheme(stylesProvider)
]);
