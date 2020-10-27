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

interface Props {
    styles: ReturnType<typeof stylesProvider>;
}
// To furthure complete
// type StatisticsData = {
//     headerValue: string;
//     secondaryValue: string;
//     secondaryColor?: string;
// };

// type ItemModule = {
//     type: string;
//     data: StatisticsData[];
//     displayWhen?: string;
// };

const WidgetsComponent: React.FC<Props> = ({ styles }) => {
    const renderItemModule = item => {
        switch (item.type) {
            case 'static-text-columns-bottom-header':
                return <StaticTextColumn data={item.data} />;
            case '3-lines-cta':
                return <ThreeLinesCta data={item.data} cta={item.cta} />;
            case 'balances-grid-icons':
                return <Summary data={item.data} />;
            case 'separator':
                return <View style={styles.separator} />;
            case 'single-balance-icon':
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
