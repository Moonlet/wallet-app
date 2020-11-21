import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconValues } from '../icon/values';
import { normalize } from '../../styles/dimensions';
import Icon from '../icon/icon';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { IScreenModule, IScreenValidation, IScreenWidget, ModuleTypes } from './types';
import { Text } from '../../library';
import { Blockchain } from '../../core/blockchain/types';
import { formatStyles } from './utils';
import { renderModule } from './render-module';
import { ModuleSelectableWrapper } from './components/module-selectable-wrapper/module-selectable-wrapper';
import { handleCta } from '../../redux/ui/screens/data/actions';
import {
    clearScreenInputData,
    runScreenValidation
} from '../../redux/ui/screens/input-data/actions';
import { InfoModal } from '../info-modal/info-modal';

interface IExternalProps {
    data: IScreenWidget[];
    screenKey: string;
    actions: {
        handleCta: typeof handleCta;
        clearScreenInputData: typeof clearScreenInputData;
        runScreenValidation?: typeof runScreenValidation;
    };
    blockchain: Blockchain;
    validation?: IScreenValidation;
}

interface IState {
    widgetsExpandedState: { [widgetKey: string]: boolean };
}

class WidgetsComponent extends React.Component<
    IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>,
    IState
> {
    constructor(props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>) {
        super(props);
        this.state = {
            widgetsExpandedState: {}
        };
    }

    public componentDidMount() {
        const widgetsExpandedState = {};

        for (const widget of this.props.data) {
            if (widget?.title && widget?.expandable) {
                widgetsExpandedState[this.getWidgetKey(widget.title)] = false;
            }
        }

        this.setState({ widgetsExpandedState });
    }

    public componentDidUpdate(prevProps: IExternalProps) {
        if (this.props.blockchain !== prevProps.blockchain) {
            // Widgets Expanded States set on false
            const widgetsExpandedState = this.state.widgetsExpandedState;
            Object.keys(widgetsExpandedState).map(widget => (widgetsExpandedState[widget] = false));
            this.setState({ widgetsExpandedState });
        }
    }

    private getWidgetKey(title: string) {
        return (
            'widget-' +
            title
                .split(' ')
                .join('-')
                .toLocaleLowerCase()
        );
    }

    private renderWidget(widget: IScreenWidget, index: number) {
        const { actions, screenKey, styles } = this.props;
        const { widgetsExpandedState } = this.state;

        if (widget?.expandable) {
            const widgetKey = this.getWidgetKey(widget.title);

            let isWidgetExpanded = widgetsExpandedState[widgetKey] || false;
            if (widget?.initialState === 'expanded') {
                isWidgetExpanded = true;
            }

            return (
                <TouchableOpacity
                    key={`widget-${index}`}
                    style={[styles.widgetContainer, widget?.style && formatStyles(widget.style)]}
                    activeOpacity={0.9}
                    onPress={() => {
                        const wigetsState = widgetsExpandedState;
                        wigetsState[widgetKey] = !wigetsState[widgetKey];
                        this.setState({ widgetsExpandedState: wigetsState });
                    }}
                >
                    <View>
                        <View style={styles.itemHeader}>
                            <Text style={styles.headerText}>{widget.title}</Text>
                            <Icon
                                name={
                                    isWidgetExpanded
                                        ? IconValues.CHEVRON_UP
                                        : IconValues.CHEVRON_DOWN
                                }
                                size={normalize(16)}
                                style={styles.expandingArrow}
                            />
                        </View>

                        {widget.modules.map((module: IScreenModule, i: number) => (
                            <View key={`module-${i}`}>
                                {renderModule(module, actions, {
                                    isWidgetExpanded,
                                    moduleColWrapperContainer: styles.moduleColWrapperContainer,
                                    validation: this.props.validation
                                })}
                            </View>
                        ))}
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <View
                key={`widget-${index}`}
                style={[styles.widgetContainer, widget?.style && formatStyles(widget.style)]}
            >
                {widget.title && (
                    <Text style={[styles.headerText, styles.headerTextNonExpandable]}>
                        {widget.title}
                    </Text>
                )}

                {widget.modules.map((module: IScreenModule, i: number) => (
                    <View key={`module-${i}`}>
                        {module.type === ModuleTypes.MODULE_SELECTABLE_WRAPPER ? (
                            <ModuleSelectableWrapper
                                module={module}
                                screenKey={screenKey}
                                actions={this.props.actions}
                            />
                        ) : (
                            renderModule(module, actions, {
                                screenKey,
                                moduleColWrapperContainer: styles.moduleColWrapperContainer,
                                validation: this.props.validation
                            })
                        )}

                        {module?.info && (
                            <TouchableOpacity
                                style={[
                                    styles.infoWrapper,
                                    {
                                        right:
                                            !module.info?.position ||
                                            module.info?.position === 'top-right'
                                                ? 0
                                                : undefined,
                                        left: module.info?.position === 'top-left' ? 0 : undefined
                                    },
                                    module?.info?.style && formatStyles(module.info.style)
                                ]}
                                onPress={() =>
                                    InfoModal.open(module.info.data?.cta?.params?.params)
                                }
                            >
                                {renderModule(module.info.data, actions, undefined)}
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </View>
        );
    }

    public render() {
        return (
            <View>
                {this.props.data.map((widget: IScreenWidget, index: number) =>
                    this.renderWidget(widget, index)
                )}
            </View>
        );
    }
}

export const Widgets = smartConnect<IExternalProps>(WidgetsComponent, [withTheme(stylesProvider)]);
