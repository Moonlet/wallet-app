import React from 'react';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, IIconData } from '../../types';
import { formatStyles } from '../../utils';
import Icon from '../../../icon/icon';
import { normalize } from '../../../../styles/dimensions';

interface IExternalProps {
    module: IScreenModule;
}

const IconModuleComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles } = props;
    const data = module.data as IIconData;

    const customStyle = module?.style && formatStyles(module.style);

    return (
        <Icon
            name={data.icon}
            size={(customStyle?.size as number) || normalize(18)}
            style={[styles.icon, customStyle]}
        />
    );
};

export const IconModule = smartConnect<IExternalProps>(IconModuleComponent, [
    withTheme(stylesProvider)
]);
