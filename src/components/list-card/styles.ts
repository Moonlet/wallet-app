import { StyleSheet } from 'react-native';
import { BASE_DIMENSION, BORDER_RADIUS, ICON_CONTAINER_SIZE } from '../../styles/dimensions';
import { ITheme } from '../../core/theme/itheme';
import { normalize } from '../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        card: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: normalize(BASE_DIMENSION * 2),
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            marginBottom: BASE_DIMENSION,
            borderWidth: 2,
            borderColor: theme.colors.cardBackground
        },
        labelContainer: {
            flex: 1
        },
        label: {
            fontSize: normalize(18),
            lineHeight: normalize(25),
            fontWeight: '500',
            letterSpacing: 0.38,
            color: theme.colors.text
        },
        selected: {
            borderColor: theme.colors.accentSecondary
        },
        iconContainer: {
            height: normalize(ICON_CONTAINER_SIZE),
            width: normalize(ICON_CONTAINER_SIZE),
            justifyContent: 'center'
        },
        icon: {
            color: theme.colors.accent
        }
    });
