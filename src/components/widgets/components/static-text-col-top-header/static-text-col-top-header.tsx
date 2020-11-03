import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { IScreenModule, IStaticTextColumnData } from '../../types';
import { formatDataJSXElements } from '../../utils';

interface IExternalProps {
    module: IScreenModule;
}

const StaticTextColTopHeaderComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & IExternalProps
) => {
    const { module, styles } = props;
    const data = module.data as IStaticTextColumnData[];

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

export const StaticTextColTopHeader = smartConnect<IExternalProps>(
    StaticTextColTopHeaderComponent,
    [withTheme(stylesProvider)]
);
