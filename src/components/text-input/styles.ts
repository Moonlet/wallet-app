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
            marginHorizontal: BASE_DIMENSION / 2
        },
        text: {
            fontSize: 13,
            lineHeight: 18
        },
        cursor: {
            borderRadius: BORDER_RADIUS / 3,
            backgroundColor: theme.colors.accent
        }
    });
