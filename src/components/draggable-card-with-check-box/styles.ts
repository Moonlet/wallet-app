import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight,
    LETTER_SPACING,
    ICON_CONTAINER_SIZE
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            borderRadius: BORDER_RADIUS,
            padding: BASE_DIMENSION,
            alignItems: 'center',
            marginBottom: BASE_DIMENSION,
            paddingVertical: BASE_DIMENSION * 2,
            borderWidth: 2,
            borderColor: theme.colors.cardBackground,
            backgroundColor: theme.colors.appBackground
        },
        containerActive: {
            borderColor: theme.colors.accentSecondary,
            backgroundColor: theme.colors.cardBackground
        },
        imageIcon: {
            marginLeft: BASE_DIMENSION,
            marginEnd: BASE_DIMENSION * 2
        },
        textContainer: {
            justifyContent: 'center'
        },
        mainText: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            fontWeight: '500',
            alignSelf: 'center'
        },
        subtitleText: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary
        },
        menuIcon: {
            color: theme.colors.accent
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
        }
    });
