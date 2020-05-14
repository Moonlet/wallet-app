import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalize,
    BORDER_RADIUS,
    isIphoneXorAbove
} from '../../styles/dimensions';
import { pw, ph } from '../../styles';

// TODO: check this or find a better way
const CONTAINER_TOP_PADDING =
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
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingTop: CONTAINER_TOP_PADDING,
            paddingBottom: BASE_DIMENSION * 4
        },
        closeButtonContainer: {
            position: 'absolute',
            top: CONTAINER_TOP_PADDING,
            left: BASE_DIMENSION * 2
        },
        closeButton: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        title: {
            fontSize: normalize(22),
            lineHeight: normalize(28),
            color: theme.colors.text,
            letterSpacing: 0.38,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: BASE_DIMENSION * 4
        },
        content: {
            flex: 1
        },
        inputContainer: {
            flexDirection: 'column',
            marginBottom: BASE_DIMENSION
        },
        receipientLabel: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
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
            fontSize: normalize(15),
            lineHeight: normalize(20),
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
            marginBottom: BASE_DIMENSION * 2
        },
        errorMessage: {
            fontSize: normalize(19),
            lineHeight: normalize(25),
            textAlign: 'center',
            color: theme.colors.textSecondary
        }
    });
