import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BORDER_RADIUS, BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: theme.colors.cardBackground,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.cardBackground,
            marginHorizontal: BASE_DIMENSION / 2
        },
        text: {
            fontSize: 13,
            lineHeight: 18,
            color: theme.colors.text
        },
        cursor: {
            borderRadius: BORDER_RADIUS / 3,
            backgroundColor: theme.colors.accent
        }
    });
