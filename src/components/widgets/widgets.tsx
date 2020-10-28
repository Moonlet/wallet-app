import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import { IconValues } from '../icon/values';
import { normalize } from '../../styles/dimensions';
import { StaticTextColumn } from './components/static-text-columns/static-text-columns';
import { ThreeLinesCta } from './components/three-lines-cta/three-lines-cta';
import Icon from '../icon/icon';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../core/theme/with-theme';
import { Summary } from './components/summary/summary';
import { SingleBalanceIcon } from './components/single-balance-icon/single-balance-icon';
import { Separator } from './components/separator/separator';
import {
    I3LinesCtaData,
    IImageBannerData,
    IScreenModule,
    IScreenWidget,
    ISeparatorData,
    IStaticTextColumnData,
    ModuleTypes
} from './types';
import { ImageBanner } from './components/image-banner/image-banner';

interface IExternalProps {
    data: IScreenWidget[];
    actions: any;
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

    private getWidgetKey(title: string) {
        return (
            'widget-' +
            title
                .split(' ')
                .join('-')
                .toLocaleLowerCase()
        );
    }

    private renderModule(module: IScreenModule) {
        switch (module.type) {
            case ModuleTypes.STATIC_TEXT_COLUMNS_TOP_HEADER:
                return <StaticTextColumn data={module.data as IStaticTextColumnData[]} />;

            case ModuleTypes.STATIC_TEXT_COLUMNS_BOTTOM_HEADER:
                return <StaticTextColumn data={module.data as IStaticTextColumnData[]} inverted />;

            case ModuleTypes.THREE_LINES_CTA:
                return <ThreeLinesCta data={module.data as I3LinesCtaData[]} cta={module.cta} />;

            case ModuleTypes.BALANCES_GRID_ICONS:
                return <Summary data={module.data} />;

            case ModuleTypes.SEPARATOR: {
                const data: ISeparatorData = module.data[0] as ISeparatorData;
                return <Separator color={data?.color} />;
            }

            case ModuleTypes.SINGLE_BALANCE_ICON:
                return <SingleBalanceIcon data={module.data} />;

            case ModuleTypes.IMAGE_BANNER: {
                const data: IImageBannerData = module.data[0] as IImageBannerData;

                return <ImageBanner imageUrl={data.imageUrl} urlToOpen={module.cta.params.url} />;
            }

            // case ModuleTypes.TWO_LINES_TEXT_BANNER:
            //     return (
            //         <QuickDelegateBanner
            //             blockchain={this.props.blockchain}
            //             account={props.account}
            //             chainId={props.chainId}
            //             style={styles.quickDelegateBannerContainer}
            //             accountStats={props.accountStats}
            //         />
            //     );

            default:
                return null;
        }
    }

    private renderWidget(widget: IScreenWidget, index: number) {
        // widget.title
        const { styles, theme } = this.props;
        const { widgetsExpandedState } = this.state;

        if (widget?.expandable) {
            const widgetKey = this.getWidgetKey(widget.title);

            let isWidgetExpanded = widgetsExpandedState[widgetKey] || false;
            if (widget?.initialState === 'expanded') {
                isWidgetExpanded = true;
            }

            return (
                <TouchableHighlight
                    onPress={() => {
                        const wigetsState = widgetsExpandedState;
                        wigetsState[widgetKey] = !wigetsState[widgetKey];
                        this.setState({ widgetsExpandedState: wigetsState });
                    }}
                    underlayColor={theme.colors.cardBackground}
                >
                    <View key={`widget-${index}`} style={styles.widgetContainer}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.headerText}>{widget.title}</Text>
                            <Icon
                                name={IconValues.CHEVRON_DOWN}
                                size={normalize(16)}
                                style={styles.expandingArrow}
                            />
                        </View>

                        {widget.modules.map((module: IScreenModule, i: number) => {
                            let showModule = false;

                            if (!module?.displayWhen || isWidgetExpanded) {
                                showModule = true;
                            }

                            return (
                                <View key={`module-${i}`}>
                                    {showModule && this.renderModule(module)}
                                    {/* <ExpandableContainer isExpanded={showModule}>
                                        {this.renderModule(module)}
                                    </ExpandableContainer> */}
                                </View>
                            );
                        })}
                    </View>
                </TouchableHighlight>
            );
        }

        return (
            <View key={`widget-${index}`} style={styles.widgetContainer}>
                {widget.modules.map((module: IScreenModule, i: number) => (
                    <View key={`module-${i}`}>{this.renderModule(module)}</View>
                ))}
            </View>
        );

        // return (
        //     <View key={`widget-${index}`} style={styles.widgetContainer}>
        //         <View style={styles.itemHeader}>
        //             <Text style={styles.headerText}>{widget.title}</Text>
        //             <Icon
        //                 name={IconValues.CHEVRON_DOWN}
        //                 size={normalize(16)}
        //                 style={styles.expandingArrow}
        //             />
        //         </View>
        //         {renderModules(widget.modules)}
        //     </View>
        // );

        // switch (item.modules[0].type) {

        //     default:
        //         return (
        //             <View style={styles.itemContainer}>
        //                 <View style={styles.itemHeader}>
        //                     <Text style={styles.headerText}>{item.title}</Text>
        //                     <Icon
        //                         name={IconValues.CHEVRON_DOWN}
        //                         size={normalize(16)}
        //                         style={styles.expandingArrow}
        //                     />
        //                 </View>
        //                 {renderModules(item.modules)}
        //             </View>
        //         );
        // }
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
