import { StyleSheet } from 'react-native';
import { BASE_DIMENSION, BORDER_RADIUS, ICON_CONTAINER_SIZE } from '../../../../styles/dimensions';
import { ITheme } from '../../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        card: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: BASE_DIMENSION * 2,
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
            fontSize: 18,
            lineHeight: 25,
            fontWeight: '500',
            letterSpacing: 0.38,
            color: theme.colors.text
        },
        selected: {
            borderColor: theme.colors.accentSecondary
        },
        iconLeftContainer: {
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE,
            marginRight: BASE_DIMENSION
        },
        iconRightContainer: {
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE,
            alignItems: 'flex-end',
            justifyContent: 'center'
        },
        icon: {
            color: theme.colors.accent
        },
        accountIcon: {
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE
        }
    });
