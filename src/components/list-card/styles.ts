import { StyleSheet } from 'react-native';
import { BASE_DIMENSION, BORDER_RADIUS, ICON_CONTAINER_SIZE } from '../../styles/dimensions';
import { ITheme } from '../../core/theme/itheme';

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
            borderWidth: 1,
            borderColor: theme.colors.cardBackground
        },
        labelContainer: {
            flex: 1
        },
        label: {
            flex: 1,
            fontSize: 18,
            lineHeight: 25,
            fontWeight: '500',
            letterSpacing: 0.38,
            color: theme.colors.text,
            opacity: 0.87
        },
        selected: {
            borderColor: theme.colors.accent
        },
        iconLeftContainer: {
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE,
            alignItems: 'flex-start',
            justifyContent: 'center'
        },
        iconRightContainer: {
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE,
            alignItems: 'flex-end',
            justifyContent: 'center'
        },
        icon: {
            color: theme.colors.accent
        }
    });
