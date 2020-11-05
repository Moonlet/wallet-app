import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { IconValues } from '../icon/values';
import { normalize } from '../../styles/dimensions';
import { ThreeLinesCta } from './components/three-lines-cta/three-lines-cta';
import Icon from '../icon/icon';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { SingleBalanceIcon } from './components/single-balance-icon/single-balance-icon';
import { Separator } from './components/separator/separator';
import {
    IScreenModule,
    IScreenModuleColumnsWrapperData,
    IScreenWidget,
    ModuleTypes
} from './types';
import { ImageBanner } from './components/image-banner/image-banner';
import { StaticTextColTopHeader } from './components/static-text-col-top-header/static-text-col-top-header';
import { StaticTextColBottomHeader } from './components/static-text-col-bottom-header/static-text-col-bottom-header';
import { BalanceGridIcons } from './components/balance-grid-icons/balance-grid-icons';
import { Text } from '../../library';
import { IAccountState } from '../../redux/wallets/state';
import { TwoLinesStakeBanner } from './components/two-lines-text-banner/two-lines-text-banner';
import { ChainIdType } from '../../core/blockchain/types';
import { ExpandableContainer } from '../expandable-container/expandable-container';
import { OneLineTextBanner } from './components/one-line-text-banner/one-line-text-banner';
import { ModuleWrapper } from './components/module-wrapper/module-wrapper';
import { ModuleSelectableWrapper } from './components/module-wrapper/module-selectable-wrapper';
import { ThreeLinesIcon } from './components/three-lines-icon/three-lines-icon';
import LinearGradient from 'react-native-linear-gradient';
import { formatStyles } from './utils';
import { IconTwoLines } from './components/icon-two-lines/icon-two-lines';

interface IExternalProps {
    data: IScreenWidget[];
    actions: any;
    account: IAccountState;
    chainId: ChainIdType;
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
        if (this.props.account.blockchain !== prevProps.account.blockchain) {
            // Widgets Expande States set on false
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

    private renderModules(
        modules: IScreenModule[],
        options?: {
            style?: any;
            colWrapperStyle?: any;
        }
    ) {
        const { styles } = this.props;

        const wrapperStyle = options?.style && formatStyles(options.style);

        const renderedModulesJSX = modules.map(m =>
            this.renderModule(m, { style: options?.style })
        );

        let modulesJSX: any;
        if (options?.colWrapperStyle) {
            modulesJSX = (
                <View style={[styles.moduleColWrapperContainer, options.colWrapperStyle]}>
                    {renderedModulesJSX}
                </View>
            );
        } else {
            modulesJSX = <View>{renderedModulesJSX}</View>;
        }

        if (wrapperStyle?.gradient) {
            return (
                <LinearGradient
                    colors={wrapperStyle.gradient as any}
                    style={[styles.modulesContainer, wrapperStyle]}
                >
                    {modulesJSX}
                </LinearGradient>
            );
        } else {
            return <View style={[styles.modulesContainer, wrapperStyle]}>{modulesJSX}</View>;
        }
    }

    private renderModule(
        module: IScreenModule,
        options?: {
            isWidgetExpanded?: boolean;
            style?: any;
        }
    ) {
        let moduleJSX = null;

        switch (module.type) {
            case ModuleTypes.STATIC_TEXT_COLUMNS_TOP_HEADER:
                moduleJSX = <StaticTextColTopHeader module={module} />;
                break;

            case ModuleTypes.STATIC_TEXT_COLUMNS_BOTTOM_HEADER:
                moduleJSX = <StaticTextColBottomHeader module={module} />;
                break;

            case ModuleTypes.THREE_LINES_CTA:
                moduleJSX = (
                    <ThreeLinesCta
                        module={module}
                        actions={this.props.actions}
                        account={this.props.account}
                    />
                );
                break;

            case ModuleTypes.BALANCES_GRID_ICONS:
                moduleJSX = <BalanceGridIcons module={module} />;
                break;

            case ModuleTypes.SEPARATOR:
                moduleJSX = <Separator module={module} />;
                break;

            case ModuleTypes.SINGLE_BALANCE_ICON:
                moduleJSX = <SingleBalanceIcon module={module} />;
                break;

            case ModuleTypes.IMAGE_BANNER:
                moduleJSX = <ImageBanner module={module} />;
                break;

            case ModuleTypes.TWO_LINES_TEXT_BANNER:
                moduleJSX = (
                    <TwoLinesStakeBanner
                        module={module}
                        account={this.props.account}
                        chainId={this.props.chainId}
                    />
                );
                break;

            case ModuleTypes.ONE_LINE_TEXT_BANNER:
                moduleJSX = <OneLineTextBanner module={module} />;
                break;

            case ModuleTypes.THREE_LINES_ICON:
                moduleJSX = <ThreeLinesIcon module={module} />;
                break;

            case ModuleTypes.ICON_TWO_LINES:
                moduleJSX = <IconTwoLines module={module} />;
                break;

            case ModuleTypes.MODULE_WRAPPER:
                moduleJSX = (
                    <ModuleWrapper
                        module={module}
                        renderModule={m => this.renderModule(m, options)}
                    />
                );
                break;

            case ModuleTypes.MODULE_SELECTABLE_WRAPPER:
                moduleJSX = (
                    <ModuleSelectableWrapper
                        module={module}
                        renderModules={(modules: IScreenModule[], style: any) =>
                            this.renderModules(modules, { style })
                        }
                    />
                );
                break;

            case ModuleTypes.MODULE_COLUMNS_WRAPPER:
                const colWrapperData = module.data as IScreenModuleColumnsWrapperData;
                moduleJSX = this.renderModules(colWrapperData.submodules, {
                    style: options?.style,
                    colWrapperStyle: colWrapperData?.style ? formatStyles(colWrapperData.style) : {}
                });

                break;

            default:
                return null;
        }

        if (options?.isWidgetExpanded === undefined) {
            return moduleJSX;
        } else {
            if (!module?.displayWhen) {
                return moduleJSX;
            }

            let showModule = false;
            if (!module?.displayWhen || options?.isWidgetExpanded) {
                showModule = true;
            }

            return (
                <View>
                    <ExpandableContainer isExpanded={showModule}>{moduleJSX}</ExpandableContainer>
                </View>
            );
        }
    }

    private renderWidget(widget: IScreenWidget, index: number) {
        const { styles } = this.props;
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
                                {this.renderModule(module, {
                                    isWidgetExpanded
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
                    <View key={`module-${i}`}>{this.renderModule(module, undefined)}</View>
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
