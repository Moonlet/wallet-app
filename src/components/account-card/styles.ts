import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, ICON_CONTAINER_SIZE } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingHorizontal: BASE_DIMENSION / 2,
            paddingVertical: BASE_DIMENSION * 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION,
            flexDirection: 'row'
            // padding: 12
        },
        accountInfoContainer: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            marginHorizontal: BASE_DIMENSION
        },
        iconContainer: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            justifyContent: 'center',
            alignItems: 'center'
        },
        icon: {
            color: theme.colors.accent
        },
        amountContainer: {
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        address: {
            fontSize: 16,
            lineHeight: 20,
            color: theme.colors.text,
            opacity: 0.67
        },
        firstAmount: {
            fontSize: 18,
            letterSpacing: 0.38,
            color: theme.colors.text,
            opacity: 0.87,
            fontWeight: '500'
        },
        secondAmount: {
            fontSize: 12,
            letterSpacing: 0.38,
            color: theme.colors.text,
            opacity: 0.87,
            marginLeft: 8,
            fontWeight: '500'
        }
    });
