import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight, SCREEN_HEIGHT } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 3,
            paddingVertical: BASE_DIMENSION * 4,
            marginBottom: BASE_DIMENSION * 2,
            backgroundColor: theme.colors.appBackground,
            flexDirection: 'column',
            height: SCREEN_HEIGHT
        },
        rowContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2,
            paddingHorizontal: BASE_DIMENSION / 2
        },
        rowTextContainer: {
            flex: 1,
            flexDirection: 'column'
        },
        titleUnread: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: '#FFFFFF',
            fontWeight: '600'
        },
        titleRead: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textSecondary
        },
        subtitleUnread: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.text
        },
        subtitleRead: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.textTertiary
        },
        rightIcon: {
            alignSelf: 'center',
            color: theme.colors.accent
        }
    });
