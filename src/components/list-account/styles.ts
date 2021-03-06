import { StyleSheet } from 'react-native';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    ICON_CONTAINER_SIZE,
    normalizeFontAndLineHeight,
    LETTER_SPACING,
    normalize
} from '../../styles/dimensions';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        card: {
            flexDirection: 'row',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            padding: BASE_DIMENSION,
            alignItems: 'center',
            marginBottom: BASE_DIMENSION,
            paddingVertical: BASE_DIMENSION * 2,
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
            color: theme.colors.text,
            flexShrink: 1
        },
        selected: {
            borderColor: theme.colors.accentSecondary
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
        },
        addButton: {
            width: normalize(110),
            backgroundColor: theme.colors.accent,
            borderColor: theme.colors.accent
        },
        addButtonDisabled: {
            width: normalize(110)
        }
    });
