import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import stylesProvider from './styles';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import {
    IAbsoluteModulesData,
    IScreenContext,
    IScreenModule,
    ISmartScreenActions
} from '../../types';
import { formatStyles } from '../../utils';
import { renderModule } from '../../render-module';

interface IExternalProps {
    module: IScreenModule;
    context: IScreenContext;
    options?: {
        screenKey?: string;
        flowId?: string;
    };
    actions: ISmartScreenActions;
}

class AbsoluteModulesComponent extends React.Component<
    IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
> {
    public componentDidMount() {
        if (this.props.module?.state?.actions) {
            this.props.actions.runScreenStateActions({
                actions: this.props.module.state.actions,
                context: this.props.context,
                screenKey: this.props.options?.screenKey
            });
        }
    }

    public render() {
        const { module, styles } = this.props;
        const data = module.data as IAbsoluteModulesData;

        const { module1, module2 } = data;

        const moduleJSX = (
            <View>
                {/* Module 1 */}
                <View style={[styles.moduleContainer, formatStyles(module1?.style)]}>
                    {renderModule(
                        module1.module,
                        this.props.context,
                        this.props.actions,
                        this.props.options
                    )}
                </View>

                {/* Module 2 */}
                <View style={[styles.moduleContainer, formatStyles(module2?.style)]}>
                    {renderModule(
                        module2.module,
                        this.props.context,
                        this.props.actions,
                        this.props.options
                    )}
                </View>
            </View>
        );

        if (module?.cta) {
            return (
                <TouchableOpacity
                    onPress={() => this.props.actions.handleCta(module.cta, this.props?.options)}
                    activeOpacity={0.9}
                    style={formatStyles(module?.style)}
                >
                    {moduleJSX}
                </TouchableOpacity>
            );
        } else {
            return <View style={formatStyles(module?.style)}>{moduleJSX}</View>;
        }
    }
}

export const AbsoluteModules = smartConnect<IExternalProps>(AbsoluteModulesComponent, [
    withTheme(stylesProvider)
]);
