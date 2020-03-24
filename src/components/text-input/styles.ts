import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BORDER_RADIUS, BASE_DIMENSION, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: theme.colors.cardBackground,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.cardBackground,
            marginHorizontal: BASE_DIMENSION / 2
        },
        text: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            color: theme.colors.text
        },
        cursor: {
            height: 20,
            borderRadius: BORDER_RADIUS / 3,
            backgroundColor: theme.colors.accent
        }
    });
