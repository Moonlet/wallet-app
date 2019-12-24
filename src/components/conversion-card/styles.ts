import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION,
            marginHorizontal: BASE_DIMENSION / 2,
            justifyContent: 'center',
            alignItems: 'center'
        },
        conversionLabel: {
            color: theme.colors.textSecondary
        },
        changeUp: {
            color: theme.colors.positive
        },
        changeDown: {
            color: theme.colors.negative
        },
        text: {
            fontSize: 13,
            lineHeight: 18
        },
        convert: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.text
        }
    });
