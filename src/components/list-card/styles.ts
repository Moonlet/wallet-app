import { StyleSheet } from 'react-native';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../styles/dimensions';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        card: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: 80,
            padding: BASE_DIMENSION * 2,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            marginBottom: BASE_DIMENSION,
            borderWidth: 1,
            borderColor: theme.colors.cardBackground
        },

        selected: {
            borderColor: theme.colors.accent
        },

        icon: {
            color: theme.colors.accent,
            marginRight: BASE_DIMENSION * 2
        }
    });
