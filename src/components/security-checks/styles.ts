import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../styles/dimensions';
import { pw, ph } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingBottom: BASE_DIMENSION * 2,
            backgroundColor: theme.colors.appBackground
        },
        content: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 3,
            paddingTop: BASE_DIMENSION * 2
        },
        bottomButton: {
            width: '100%',
            marginBottom: BASE_DIMENSION * 2
        },
        confirmTextContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2
        },
        textStyle: {
            color: theme.colors.text,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 2
        },
        title: {
            fontSize: normalizeFontAndLineHeight(25),
            lineHeight: normalizeFontAndLineHeight(30),
            marginBottom: BASE_DIMENSION * 6
        },
        message: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            marginBottom: BASE_DIMENSION * 4
        },
        warning: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            fontWeight: 'bold'
        },
        imageContainerStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        imageStyle: {
            width: pw(50),
            height: ph(50),
            opacity: 0.7
        }
    });
