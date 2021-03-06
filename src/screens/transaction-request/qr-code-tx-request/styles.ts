import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    BORDER_RADIUS,
    isIphoneXorAbove
} from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexGrow: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingBottom: Platform.select({
                default: BASE_DIMENSION * 10,
                ios: isIphoneXorAbove() ? BASE_DIMENSION * 11 : BASE_DIMENSION * 10
            })
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
        inputText: {
            flex: 1,
            color: theme.colors.textSecondary,
            paddingRight: BASE_DIMENSION * 2,
            fontSize: normalizeFontAndLineHeight(15)
        },
        leftIcon: {
            color: theme.colors.accent,
            alignSelf: 'center',
            paddingRight: BASE_DIMENSION
        },
        insufficientFunds: {
            fontSize: normalizeFontAndLineHeight(14),
            lineHeight: normalizeFontAndLineHeight(19),
            color: theme.colors.error,
            marginBottom: BASE_DIMENSION
        }
    });
