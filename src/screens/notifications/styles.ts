import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight, SCREEN_HEIGHT } from '../../styles/dimensions';
import { ph, pw } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            flexDirection: 'column',
            height: SCREEN_HEIGHT
        },
        scrollContainer: {
            flexGrow: 1,
            paddingHorizontal: BASE_DIMENSION * 3,
            paddingVertical: BASE_DIMENSION * 4
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
        },
        emptyContainer: {
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center'
        },
        logoImage: {
            height: ph(30),
            width: pw(60),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginBottom: BASE_DIMENSION * 6
        }
    });
