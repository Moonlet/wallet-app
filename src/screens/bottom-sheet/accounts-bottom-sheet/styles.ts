import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#2c2c2fAA'
        },
        header: {
            flex: 1,
            backgroundColor: theme.colors.cardBackgroundSecondary,
            paddingVertical: BASE_DIMENSION * 2,
            borderTopLeftRadius: BORDER_RADIUS * 3,
            borderTopRightRadius: BORDER_RADIUS * 3,
            alignItems: 'center'
        },
        panelHandle: {
            width: 40,
            height: 8,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.accent
        }
    });
