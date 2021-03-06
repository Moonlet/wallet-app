import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalize,
    normalizeFontAndLineHeight
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.colors.appBackground
        },
        headerButtonContainer: {
            flexDirection: 'row'
        },
        headerButton: {
            flex: 1,
            paddingVertical: BASE_DIMENSION,
            backgroundColor: theme.colors.appBackground,
            borderWidth: 1
        },
        textButton: {
            lineHeight: normalizeFontAndLineHeight(22),
            textAlign: 'center'
        },
        keyboardLayout: {
            flex: 1,
            backgroundColor: theme.colors.cardBackground,
            padding: BASE_DIMENSION,
            paddingBottom: BASE_DIMENSION * 2
        },
        footerContainer: {
            backgroundColor: theme.colors.cardBackground,
            paddingVertical: BASE_DIMENSION,
            marginVertical: BASE_DIMENSION,
            marginHorizontal: BASE_DIMENSION * 3,
            borderRadius: BORDER_RADIUS
        },
        footerText: {
            textAlign: 'center',
            fontSize: normalizeFontAndLineHeight(14),
            color: theme.colors.text
        },
        pasteWordText: {
            fontSize: normalizeFontAndLineHeight(14),
            textAlign: 'center',
            color: theme.colors.text
        },
        confirmWordText: {
            textAlign: 'center',
            color: theme.colors.accent,
            fontSize: normalizeFontAndLineHeight(14)
        },
        rowContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: normalize(6)
        },
        keyContainer: {
            flex: 1,
            backgroundColor: '#666666',
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION,
            maxWidth: normalize(35),
            marginHorizontal: normalize(3),
            justifyContent: 'center',
            alignContent: 'center'
        },
        keyText: {
            flex: 1,
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(26),
            textAlign: 'center',
            color: theme.colors.text
        },
        upperIconContainer: {
            flex: 1,
            backgroundColor: '#444444',
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION,
            maxWidth: normalize(42),
            justifyContent: 'center',
            alignContent: 'center',
            marginRight: BASE_DIMENSION
        },
        upperIcon: {
            alignSelf: 'center',
            color: theme.colors.text
        },
        deleteIconContainer: {
            flex: 1,
            backgroundColor: '#444444',
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION,
            maxWidth: normalize(42),
            justifyContent: 'center',
            alignContent: 'center',
            marginLeft: BASE_DIMENSION
        },
        deleteIcon: {
            alignSelf: 'center',
            color: theme.colors.text
        },
        icon: {
            color: theme.colors.textSecondary
        }
    });
