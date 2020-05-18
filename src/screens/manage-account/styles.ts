import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    ICON_CONTAINER_SIZE,
    normalize,
    normalizeFontAndLineHeight
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingVertical: BASE_DIMENSION * 3,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground
        },
        rowContainer: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            borderWidth: 2,
            padding: BASE_DIMENSION,
            alignItems: 'center',
            marginBottom: BASE_DIMENSION,
            paddingVertical: BASE_DIMENSION * 2
        },
        firstAmount: {
            fontWeight: '500',
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            letterSpacing: 0.38,
            color: theme.colors.text
        },
        secondAmount: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary
        },
        menuIcon: {
            color: theme.colors.accent
        },
        accountIcon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        infoContainer: {
            flex: 1,
            flexDirection: 'row'
        },
        iconContainer: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            justifyContent: 'center',
            alignItems: 'center'
        },
        amountContainer: {
            display: 'flex',
            flexDirection: 'column',
            marginLeft: BASE_DIMENSION
        },

        // Swipeable left actions
        leftActionsContainer: {
            flexDirection: 'row'
        },
        action: {
            justifyContent: 'center',
            alignItems: 'center',
            width: normalize(72)
        },
        iconActionPositive: {
            height: normalize(40),
            color: theme.colors.accent
        },
        iconActionNegative: {
            height: normalize(40),
            color: theme.colors.error
        },
        textActionPositive: {
            fontSize: normalizeFontAndLineHeight(10),
            color: theme.colors.accent
        },
        textActionNegative: {
            fontSize: normalizeFontAndLineHeight(10),
            color: theme.colors.error
        }
    });
