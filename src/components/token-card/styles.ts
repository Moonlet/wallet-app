import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    ICON_CONTAINER_SIZE,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingHorizontal: BASE_DIMENSION,
            paddingVertical: BASE_DIMENSION * 2
        },
        cardRow: {
            flex: 1,
            flexDirection: 'row'
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
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary
        },
        firstAmount: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            fontWeight: '500'
        },
        secondAmount: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary
        },
        tokenIcon: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE
        },
        imageStyle: {
            marginLeft: BASE_DIMENSION / 2
        }
    });
