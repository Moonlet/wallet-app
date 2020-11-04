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
import { IScreenModule, IScreenWidget, ModuleTypes } from './types';
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

    public renderModule(module: IScreenModule, isWidgetExpanded: boolean) {
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

            case ModuleTypes.MODULE_WRAPPER:
                moduleJSX = (
                    <ModuleWrapper
                        module={module}
                        renderModule={m => this.renderModule(m, isWidgetExpanded)}
                    />
                );
                break;

            default:
                return null;
        }

        if (isWidgetExpanded === undefined) {
            return moduleJSX;
        } else {
            if (!module?.displayWhen) {
                return moduleJSX;
            }

            let showModule = false;
            if (!module?.displayWhen || isWidgetExpanded) {
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
                    style={styles.widgetContainer}
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
                                {this.renderModule(module, isWidgetExpanded)}
                            </View>
                        ))}
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <View key={`widget-${index}`} style={styles.widgetContainer}>
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
