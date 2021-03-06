import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalize,
    ICON_CONTAINER_SIZE,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';
import { ph, pw } from '../../../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            justifyContent: 'flex-start',
            flex: 1,
            backgroundColor: theme.colors.appBackground
        },
        logoImage: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            alignSelf: 'center',
            resizeMode: 'cover',
            opacity: 0.1,
            height: ph(50),
            width: pw(100)
        },
        headerContainer: {
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'column',
            marginHorizontal: BASE_DIMENSION * 8
        },
        title: {
            fontSize: normalizeFontAndLineHeight(28),
            lineHeight: normalizeFontAndLineHeight(34),
            textAlign: 'center',
            marginBottom: BASE_DIMENSION,
            color: theme.colors.text
        },
        subTitle: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            textAlign: 'center',
            marginBottom: BASE_DIMENSION * 4,
            color: theme.colors.textSecondary
        },
        errorMessage: {
            marginTop: BASE_DIMENSION * 2,
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.error,
            textAlign: 'center'
        },
        digitsLayout: {
            flex: 1,
            paddingBottom: BASE_DIMENSION * 2
        },
        keyRow: {
            flex: 1,
            flexDirection: 'row'
        },
        keyContainer: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme.colors.appBackground,
            margin: BASE_DIMENSION / 4
        },
        keyText: {
            fontSize: normalizeFontAndLineHeight(28),
            lineHeight: normalizeFontAndLineHeight(34),
            color: theme.colors.text,
            textAlign: 'center'
        },
        touchIdIcon: {
            alignSelf: 'center',
            color: theme.colors.accent
        },
        deleteIcon: {
            alignSelf: 'center',
            color: theme.colors.textTertiary
        },
        inputRow: {
            justifyContent: 'center',
            flexDirection: 'row'
        },
        gradientContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        selectorGradientContainer: {
            height: 1,
            width: '100%'
        },
        gradientRowContainer: {
            height: '100%',
            width: 1
        },
        pinInput: {
            width: normalize(20),
            height: normalize(20),
            borderRadius: normalize(10),
            marginLeft: normalize(10),
            marginRight: normalize(10)
        },
        unchecked: {
            borderColor: theme.colors.text,
            borderWidth: 1
        },
        checked: {
            backgroundColor: theme.colors.accent,
            borderRadius: normalize(10)
        },
        reset: {
            lineHeight: normalizeFontAndLineHeight(22),
            fontWeight: '600',
            color: theme.colors.accent,
            textAlign: 'center'
        },
        backIconContainer: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: BASE_DIMENSION
        },
        backIcon: {
            color: theme.colors.accent
        }
    });
