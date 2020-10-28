import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { Text } from '../../../../library';
import { IStaticTextColumnData } from '../../types';

interface ExternalProps {
    data: IStaticTextColumnData[];
}

const StaticTextColTopHeaderComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & ExternalProps
) => {
    const { data, styles, theme } = props;

    return (
        <View style={styles.container}>
            {data.map((item: IStaticTextColumnData, index: number) => (
                <View key={`static-text-col-top-header-${index}`}>
                    <Text
                        style={[
                            styles.headerValueText,
                            {
                                color: item?.headerColor
                                    ? item.headerColor
                                    : theme.colors.textSecondary
                            }
                        ]}
                    >
                        {item.headerValue}
                    </Text>
                    <Text
                        style={[
                            styles.secondaryValueText,
                            {
                                color: item?.secondaryColor
                                    ? item.secondaryColor
                                    : theme.colors.text
                            }
                        ]}
                    >
                        {item.secondaryValue}
                    </Text>
                </View>
            ))}
        </View>
    );
};

export const StaticTextColTopHeader = smartConnect<ExternalProps>(StaticTextColTopHeaderComponent, [
    withTheme(stylesProvider)
]);
