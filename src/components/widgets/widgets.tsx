import React from 'react';
import { View, Text } from 'react-native';
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

const WidgetsComponent = (
    props: IExternalProps & IThemeProps<ReturnType<typeof stylesProvider>>
) => {
    const { styles } = props;

    const renderModule = (module: IScreenModule) => {
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

            default:
                return null;
        }
    };

    const renderWidget = (widget: IScreenWidget, index: number) => {
        // widget.title

        if (widget?.expandable) {
            return (
                <View key={`widget-${index}`} style={styles.widgetContainer}>
                    <View style={styles.itemHeader}>
                        <Text style={styles.headerText}>{widget.title}</Text>
                        <Icon
                            name={IconValues.CHEVRON_DOWN}
                            size={normalize(16)}
                            style={styles.expandingArrow}
                        />
                    </View>
                    {widget.modules.map((module: IScreenModule, i: number) => (
                        <View key={`module-${i}`}>{renderModule(module)}</View>
                    ))}
                </View>
            );
        }

        return (
            <View key={`widget-${index}`} style={styles.widgetContainer}>
                {widget.modules.map((module: IScreenModule, i: number) => (
                    <View key={`module-${i}`}>{renderModule(module)}</View>
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
    };

    return (
        <View>
            {props.data.map((widget: IScreenWidget, index: number) => renderWidget(widget, index))}
        </View>
    );
};

export const Widgets = smartConnect<IExternalProps>(WidgetsComponent, [withTheme(stylesProvider)]);
