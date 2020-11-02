import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { IStaticTextColumnData } from '../../types';
import { formatDataJSXElements } from '../../utils';

interface IExternalProps {
    data: IStaticTextColumnData[];
}

const StaticTextColBottomHeaderComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { data, styles } = props;

    return (
        <View style={styles.container}>
            {data.map((item: IStaticTextColumnData, index: number) => (
                <View style={styles.itemContainer} key={`static-text-col-bottom-header-${index}`}>
                    <View style={styles.row}>
                        {formatDataJSXElements(item.body, styles.bodyText)}
                    </View>
                    <View style={styles.row}>
                        {formatDataJSXElements(item.header, styles.headerText)}
                    </View>
                </View>
            ))}
        </View>
    );
};

export const StaticTextColBottomHeader = smartConnect<IExternalProps>(
    StaticTextColBottomHeaderComponent,
    [withTheme(stylesProvider)]
);
