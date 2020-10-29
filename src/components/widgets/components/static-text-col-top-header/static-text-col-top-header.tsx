import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { IStaticTextColumnData } from '../../types';
import { formatDataJSXElements } from '../../utils';

interface ExternalProps {
    data: IStaticTextColumnData[];
}

const StaticTextColTopHeaderComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & ExternalProps
) => {
    const { data, styles } = props;

    return (
        <View style={styles.container}>
            {data.map((item: IStaticTextColumnData, index: number) => (
                <View key={`static-text-col-top-header-${index}`}>
                    <View style={styles.row}>
                        {formatDataJSXElements(item.header, styles.headerText)}
                    </View>
                    <View style={styles.row}>
                        {formatDataJSXElements(item.body, styles.bodyText)}
                    </View>
                </View>
            ))}
        </View>
    );
};

export const StaticTextColTopHeader = smartConnect<ExternalProps>(StaticTextColTopHeaderComponent, [
    withTheme(stylesProvider)
]);
