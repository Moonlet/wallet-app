import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';
import { ph, pw } from '../../../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground
        },
        scrollContainer: {
            flexGrow: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingBottom: BASE_DIMENSION * 4
        },
        moonletImage: {
            height: ph(20),
            width: pw(50),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginVertical: BASE_DIMENSION * 6
        },
        authMoonletUserAccountText: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.text,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: BASE_DIMENSION * 5,
            marginHorizontal: BASE_DIMENSION
        },
        copyAuthButton: {
            marginHorizontal: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION * 2
        },
        defaultButtonContainer: {
            flex: 1,
            justifyContent: 'flex-end'
        },
        defaultButton: {
            marginHorizontal: BASE_DIMENSION * 2
        },
        domain: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.text,
            justifyContent: 'flex-end',
            alignItems: 'center',
            alignSelf: 'center'
        },
        inputContainer: {
            marginBottom: BASE_DIMENSION * 4
        },
        inputBox: {
            height: BASE_DIMENSION * 5 + BASE_DIMENSION / 2,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: BASE_DIMENSION * 2,
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION / 2
        },
        inputText: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION * 2,
            fontSize: normalizeFontAndLineHeight(17)
        },
        infoText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20)
        },
        checkingText: {
            color: theme.colors.error
        },
        errorText: {
            color: theme.colors.negative
        },
        congratsText: {
            color: theme.colors.accent
        },
        createHereText: {
            color: theme.colors.accent
        },
        authProgressContainer: {
            flex: 1,
            justifyContent: 'center',
            marginTop: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION * 2
        },
        loadingContainer: {
            paddingBottom: BASE_DIMENSION * 3
        },
        authProgressText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.accent,
            textAlign: 'center'
        }
    });
