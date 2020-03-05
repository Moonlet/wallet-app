import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, ICON_CONTAINER_SIZE } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingHorizontal: BASE_DIMENSION,
            paddingVertical: BASE_DIMENSION * 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION,
            flexDirection: 'row'
        },
        accountInfoContainer: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            marginLeft: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        icon: {
            color: theme.colors.accent
        },
        address: {
            fontSize: 16,
            lineHeight: 20,
            color: theme.colors.textSecondary
        },
        firstAmount: {
            fontSize: 18,
            lineHeight: 25,
            letterSpacing: 0.38,
            color: theme.colors.text,
            fontWeight: '500'
        },
        secondAmount: {
            fontSize: 16,
            lineHeight: 20,
            color: theme.colors.textSecondary
        },
        tokenIcon: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE
        }
    });
