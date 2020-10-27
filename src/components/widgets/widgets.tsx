import React from 'react';
import { View, FlatList, Text } from 'react-native';
import widgets from './widget.json';
import { IconValues } from '../icon/values';
import { normalize } from '../../styles/dimensions';
import { StaticTextColumn } from '../static-text-columns/static-text-columns';
import { ThreeLinesCta } from '../three-lines-cta/three-lines-cta';
import Icon from '../icon/icon';
import stylesProvider from './styles';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme } from '../../core/theme/with-theme';
import { ImageBanner } from '../image-banner/image-banner';
import { Summary } from '../summary/summary';
import { SingleBalanceIcon } from '../single-balance-icon/single-balance-icon';
import { IModules, IStaticTextColHeaderData, I3LinesCtaData, ModuleTypes } from './types';

interface Props {
    styles: ReturnType<typeof stylesProvider>;
}

const WidgetsComponent: React.FC<Props> = ({ styles }) => {
    const renderItemModule = (item: IModules) => {
        switch (item.type) {
            case ModuleTypes.STATIC_TEXT_COLUMNS_TOP_HEADER:
                return <StaticTextColumn data={item.data as IStaticTextColHeaderData[]} />;
            case ModuleTypes.STATIC_TEXT_COLUMNS_BOTTOM_HEADER:
                return <StaticTextColumn data={item.data as IStaticTextColHeaderData[]} inverted />;
            case ModuleTypes.THREE_LINES_CTA:
                return <ThreeLinesCta data={item.data as I3LinesCtaData[]} cta={item.cta} />;
            case ModuleTypes.BALANCES_GRID_ICONS:
                return <Summary data={item.data} />;
            case ModuleTypes.SEPARATOR:
                return <View style={styles.separator} />;
            case ModuleTypes.SINGLE_BALANCE_ICON:
                return <SingleBalanceIcon data={item.data} />;
            default:
                return null;
        }
    };

    const renderModules = modules => {
        return (
            <View style={styles.modulesContainer}>
                {modules.map(item => {
                    return renderItemModule(item);
                })}
            </View>
        );
    };

    const renderItem = ({ item }) => {
        switch (item.modules[0].type) {
            case 'image-banner':
                return (
                    <ImageBanner
                        imageUrl={item.modules[0].data[0].imageUrl}
                        urlToOpen={item.modules[0].cta.params.url}
                    />
                );
            default:
                return (
                    <View style={styles.itemContainer}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.headerText}>{item.title}</Text>
                            <Icon
                                name={IconValues.CHEVRON_DOWN}
                                size={normalize(16)}
                                style={styles.expandingArrow}
                            />
                        </View>
                        {renderModules(item.modules)}
                    </View>
                );
        }
    };

    const itemSeparator = () => {
        return <View style={styles.separatorContainer} />;
    };
    return (
        <View style={styles.generalFlex}>
            <FlatList
                style={styles.generalFlex}
                data={widgets.result.data.widgets}
                renderItem={item => renderItem(item)}
                ItemSeparatorComponent={() => itemSeparator()}
            />
        </View>
    );
};

export const Widgets = smartConnect(WidgetsComponent, [withTheme(stylesProvider)]);
