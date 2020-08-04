import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    BORDER_RADIUS,
    isIphoneXorAbove,
    LETTER_SPACING
} from '../../styles/dimensions';
import { pw, ph } from '../../styles';

// TODO: check this or find a better way
export const CONTAINER_TOP_PADDING =
    Platform.OS === 'ios'
        ? isIphoneXorAbove()
            ? BASE_DIMENSION * 8
            : BASE_DIMENSION * 6
        : BASE_DIMENSION * 2;

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingTop: CONTAINER_TOP_PADDING
        },
        closeButtonContainer: {
            position: 'absolute',
            top: CONTAINER_TOP_PADDING - BASE_DIMENSION / 2,
            left: BASE_DIMENSION + BASE_DIMENSION / 2,
            padding: BASE_DIMENSION
        },
        closeButton: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        title: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.text,
            letterSpacing: LETTER_SPACING,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: BASE_DIMENSION
        },
        content: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 4 // maybe remove this
        },
        moonletTransferContainer: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        errorWrapper: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 3,
            paddingBottom: BASE_DIMENSION * 6
        },
        inputContainer: {
            flexDirection: 'column',
            marginBottom: BASE_DIMENSION
        },
        receipientLabel: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.textSecondary
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        confirmTransactionText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary,
            alignSelf: 'center'
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'column'
        },
        logoImage: {
            height: ph(30),
            width: pw(60),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginBottom: BASE_DIMENSION
        },
        errorMessage: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            textAlign: 'center',
            color: theme.colors.textSecondary
        }
    });
