import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    SCREEN_HEIGHT,
    LETTER_SPACING,
    normalize
} from '../../styles/dimensions';
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
            paddingTop: BASE_DIMENSION * 4,
            paddingBottom: BASE_DIMENSION * 8
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
        title: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.white,
            fontWeight: '600',
            alignSelf: 'center'
        },
        subtitle: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.text
        },
        rightIcon: {
            alignSelf: 'center',
            color: theme.colors.accent
        },
        emptyContainer: {
            flex: 1,
            marginTop: BASE_DIMENSION * 3
        },
        logoImage: {
            height: ph(30),
            width: pw(60),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginBottom: BASE_DIMENSION * 3
        },
        emptyNotifTitle: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.textTertiary,
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            marginBottom: BASE_DIMENSION,
            textAlign: 'center'
        },
        emptyNotifSubtitle: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textTertiary,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION
        },
        loadingContainer: {
            paddingTop: BASE_DIMENSION,
            paddingBottom: BASE_DIMENSION * 6
        },
        notifIcon: {
            width: normalize(18),
            height: normalize(18),
            marginRight: BASE_DIMENSION
        }
    });
