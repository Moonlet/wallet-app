import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { smartConnect } from '../../core/utils/smart-connect';
import { withTheme } from '../../core/theme/with-theme';
import { ThemeContext } from '../../core/theme/theme-contex';
import stylesProvider from './styles';

type DataType = {
    headerValue: string;
    secondaryValue: string;
    secondaryColor?: string;
};

interface ExternalProps {
    data: DataType[];
}

interface Props {
    styles: ReturnType<typeof stylesProvider>;
}

const StaticTextColumnComponent: React.FC<Props & ExternalProps> = ({ data, styles }) => {
    const theme = useContext(ThemeContext);
    return (
        <View style={styles.container}>
            {data.map(item => {
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
            })}
        </View>
    );
};

export const StaticTextColumn = smartConnect<ExternalProps>(StaticTextColumnComponent, [
    withTheme(stylesProvider)
]);
