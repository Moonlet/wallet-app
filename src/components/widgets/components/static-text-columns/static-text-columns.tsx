import React from 'react';
import { View } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import stylesProvider from './styles';
import { IStaticTextColumnData } from '../../types';
import { Text } from '../../../../library';

interface ExternalProps {
    data: IStaticTextColumnData[];
    inverted?: boolean;
}

const StaticTextColumnComponent = (
    props: IThemeProps<ReturnType<typeof stylesProvider>> & ExternalProps
) => {
    const { data, inverted, styles, theme } = props;

    const renderHeader = (item: IStaticTextColumnData) => {
        return (
            <Text
                style={[
                    styles.headerValueText,
                    {
                        color: item?.headerColor ? item.headerColor : theme.colors.textSecondary
                    }
                ]}
            >
                {item.headerValue}
            </Text>
        );
    };

    const renderSecondaryValue = (item: IStaticTextColumnData) => {
        return (
            <Text
                style={[
                    styles.secondaryValueText,
                    {
                        color: item.secondaryColor ? item.secondaryColor : theme.colors.text
                    }
                ]}
            >
                {item.secondaryValue}
            </Text>
        );
    };

    return (
        <View style={styles.container}>
            {data.map(item => {
                if (inverted)
                    return (
                        <View style={styles.itemContainer}>
                            {renderSecondaryValue(item)}
                            {renderHeader(item)}
                        </View>
                    );
                else
                    return (
                        <View style={styles.itemContainer}>
                            {renderHeader(item)}
                            {renderSecondaryValue(item)}
                        </View>
                    );
            })}
        </View>
    );
};

export const StaticTextColumn = smartConnect<ExternalProps>(StaticTextColumnComponent, [
    withTheme(stylesProvider)
]);
