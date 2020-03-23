import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, ICON_CONTAINER_SIZE } from '../../styles/dimensions';
import { normalize } from '../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingHorizontal: BASE_DIMENSION,
            paddingVertical: BASE_DIMENSION * 2
        },
        accountInfoContainer: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            marginLeft: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        address: {
            lineHeight: normalize(20),
            color: theme.colors.textSecondary
        },
        firstAmount: {
            fontSize: normalize(18),
            lineHeight: normalize(25),
            letterSpacing: 0.38,
            color: theme.colors.text,
            fontWeight: '500'
        },
        secondAmount: {
            fontSize: normalize(16),
            lineHeight: normalize(20),
            color: theme.colors.textSecondary
        },
        tokenIcon: {
            width: normalize(ICON_CONTAINER_SIZE),
            height: normalize(ICON_CONTAINER_SIZE)
        },
        imageStyle: {
            marginLeft: BASE_DIMENSION / 2
        }
    });
