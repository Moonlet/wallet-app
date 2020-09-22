import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    SCREEN_HEIGHT,
    normalizeFontAndLineHeight,
    isIphoneXorAbove
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web
        },
        content: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 3,
            paddingBottom: Platform.select({
                default: BASE_DIMENSION * 10,
                ios: isIphoneXorAbove() ? BASE_DIMENSION * 11 : BASE_DIMENSION * 10
            })
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
        displayAddress: {
            paddingLeft: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.textSecondary,
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(19)
        },
        icon: {
            color: theme.colors.accent
        },

        //
        amountContainer: {
            flex: 1,
            marginHorizontal: BASE_DIMENSION * 2
        },

        // step 3
        confirmTransactionContainer: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 3,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        confirmTransactionText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary,
            alignSelf: 'center'
        },

        // Other
        loadingModalContainer: {
            flexDirection: 'column',
            paddingHorizontal: BASE_DIMENSION * 4
        },
        loadingModalMessage: {
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION * 8
        }
    });
