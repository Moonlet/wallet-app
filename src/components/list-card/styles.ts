import { StyleSheet } from 'react-native';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    ICON_CONTAINER_SIZE,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../styles/dimensions';
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
            borderWidth: 2,
            borderColor: theme.colors.cardBackground
        },
        labelContainer: {
            flex: 1
        },
        label: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            fontWeight: '500',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text
        },
        selected: {
            borderColor: theme.colors.accentSecondary
        },
        iconContainer: {
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE,
            justifyContent: 'center'
        },
        icon: {
            color: theme.colors.accent
        }
    });
