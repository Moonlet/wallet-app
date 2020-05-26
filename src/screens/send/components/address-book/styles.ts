import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalize,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../../../styles/dimensions';
import { pw, ph } from '../../../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        contentContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            marginTop: BASE_DIMENSION * 5
        },
        emptyAddressContainer: {
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center'
        },
        logoImage: {
            height: ph(20),
            width: pw(40),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginBottom: BASE_DIMENSION * 3
        },
        emptyAddressText: {
            fontWeight: 'bold',
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            textAlign: 'center',
            letterSpacing: LETTER_SPACING,
            opacity: 0.4,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION
        },
        addAddressBookText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            textAlign: 'center',
            opacity: 0.3,
            paddingHorizontal: BASE_DIMENSION * 2,
            color: theme.colors.text
        },
        rowContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: BASE_DIMENSION,
            paddingLeft: BASE_DIMENSION,
            backgroundColor: theme.colors.appBackground
        },
        address: {
            color: theme.colors.textSecondary
        },
        name: {
            color: theme.colors.text,
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(23)
        },
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: 'rgba(0,0,0,0.4)'
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.accent,
            padding: BASE_DIMENSION / 2
        },
        leftIcon: {
            paddingLeft: BASE_DIMENSION * 2,
            paddingRight: BASE_DIMENSION * 2
        },
        sectionTitle: {
            fontWeight: '600',
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.text,
            paddingTop: BASE_DIMENSION
        },
        selectedText: {
            color: theme.colors.accent
        },
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
