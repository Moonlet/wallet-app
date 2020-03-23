import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../styles/dimensions';

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
            fontSize: normalize(13),
            lineHeight: normalize(18)
        },
        convert: {
            lineHeight: normalize(22),
            color: theme.colors.text
        }
    });
