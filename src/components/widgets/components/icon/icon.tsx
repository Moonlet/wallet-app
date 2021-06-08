import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { IScreenModule, IIconData, ISmartScreenActions, IScreenContext } from '../../types';
import { formatStyles } from '../../utils';
import Icon from '../../../icon/icon';
import { normalize } from '../../../../styles/dimensions';

interface IExternalProps {
    module: IScreenModule;
    context: IScreenContext;
    actions: ISmartScreenActions;
    screenKey: string;
    options?: {
        screenKey?: string;
        flowId?: string;
    };
}

class IconModuleComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
> {
    public componentDidMount() {
        if (this.props.module?.state?.actions) {
            this.props.actions.runScreenStateActions({
                actions: this.props.module.state.actions,
                context: this.props.context,
                screenKey: this.props.screenKey
            });
        }
    }

    public render() {
        const { module, styles } = this.props;
        const data = module.data as IIconData;

        const customStyle = formatStyles(module?.style);

        let moduleJSX = (
            <Icon
                name={data.icon}
                size={(customStyle?.size as number) || normalize(18)}
                style={[styles.icon, customStyle]}
            />
        );

        if (data?.wrapperStyle) {
            moduleJSX = <View style={formatStyles(data.wrapperStyle)}>{moduleJSX}</View>;
        }

        if (module?.cta) {
            return (
                <TouchableOpacity
                    onPress={() => this.props.actions.handleCta(module.cta, this.props?.options)}
                    activeOpacity={0.9}
                    style={formatStyles(module?.ctaStyle)}
                >
                    {moduleJSX}
                </TouchableOpacity>
            );
        } else {
            return moduleJSX;
        }
    }
}

export const IconModule = smartConnect<IExternalProps>(IconModuleComponent, [
    withTheme(stylesProvider)
]);
