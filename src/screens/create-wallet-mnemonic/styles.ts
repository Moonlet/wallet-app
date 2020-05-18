import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight, SCREEN_HEIGHT } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web
        },
        title: {
            fontSize: normalizeFontAndLineHeight(20),
            lineHeight: normalizeFontAndLineHeight(25),
            color: theme.colors.textSecondary,
            paddingTop: BASE_DIMENSION * 2
        },
        mnemonicContainer: {
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'column'
        },
        mnemonicInfoText: {
            fontSize: normalizeFontAndLineHeight(20),
            lineHeight: normalizeFontAndLineHeight(25),
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION * 2
        },
        secretWord: {
            fontSize: normalizeFontAndLineHeight(23),
            lineHeight: normalizeFontAndLineHeight(34),
            color: theme.colors.textSecondary,
            marginLeft: BASE_DIMENSION * 5,
            fontWeight: 'bold'
        },
        checkboxContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        checkboxText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.text,
            marginRight: Platform.select({
                ios: BASE_DIMENSION * 4,
                default: BASE_DIMENSION * 2
            })
        },
        bottomContainer: {
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 6
        },
        copyButton: {
            marginBottom: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION
        },
        unveilButton: {
            marginTop: BASE_DIMENSION * 2,
            marginHorizontal: BASE_DIMENSION * 2
        }
    });
