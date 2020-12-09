import React from 'react';
import { View } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import {
    IGradientWrapperData,
    IScreenContext,
    IScreenModule,
    ISmartScreenActions
} from '../../types';
import { formatStyles } from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import { renderModule } from '../../render-module';

interface IExternalProps {
    module: IScreenModule;
    context: IScreenContext;
    actions: ISmartScreenActions;
    options: any;
}

const GradientWrapperComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles } = props;
    const data = module.data as IGradientWrapperData;

    return (
        <LinearGradient
            colors={data.gradient}
            style={[styles.container, formatStyles(module?.style)]}
        >
            {data.submodules.map((m: IScreenModule, index: number) => (
                <View key={`module-${index}`}>
                    {renderModule(m, props.context, props.actions, props.options)}
                </View>
            ))}
        </LinearGradient>
    );
};

export const GradientWrapper = smartConnect<IExternalProps>(GradientWrapperComponent, [
    withTheme(stylesProvider)
]);
