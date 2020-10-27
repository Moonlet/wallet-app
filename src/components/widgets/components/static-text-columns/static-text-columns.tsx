import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { smartConnect } from '../../../../core/utils/smart-connect';
import { withTheme, IThemeProps } from '../../../../core/theme/with-theme';
import { ThemeContext } from '../../../../core/theme/theme-contex';
import stylesProvider from './styles';
import { IStaticTextColumnData } from '../../types';

interface ExternalProps {
    data: IStaticTextColumnData[];
    inverted?: boolean;
}

const StaticTextColumnComponent: React.FC<IThemeProps<ReturnType<typeof stylesProvider>> &
    ExternalProps> = ({ data, styles, inverted = false }) => {
    const theme = useContext(ThemeContext);
    return (
        <View style={styles.container}>
            {data.map(item => {
                if (inverted)
                    return (
                        <View style={styles.itemContainer}>
                            <Text
                                style={[
                                    {
                                        color: item.secondaryColor
                                            ? item.secondaryColor
                                            : theme.colors.text
                                    },
                                    styles.secondaryValueText,
                                    styles.text
                                ]}
                            >
                                {item.secondaryValue}
                            </Text>
                            <Text style={[styles.headerValueText, styles.textColor, styles.text]}>
                                {item.headerValue}
                            </Text>
                        </View>
                    );
                else
                    return (
                        <View style={styles.itemContainer}>
                            <Text style={[styles.headerValueText, styles.textColor, styles.text]}>
                                {item.headerValue}
                            </Text>
                            <Text
                                style={[
                                    {
                                        color: item.secondaryColor
                                            ? item.secondaryColor
                                            : theme.colors.text
                                    },
                                    styles.secondaryValueText,
                                    styles.text
                                ]}
                            >
                                {item.secondaryValue}
                            </Text>
                        </View>
                    );
            })}
        </View>
    );
};

export const StaticTextColumn = smartConnect<ExternalProps>(StaticTextColumnComponent, [
    withTheme(stylesProvider)
]);
