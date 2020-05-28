import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    SCREEN_HEIGHT,
    isIphoneXorAbove,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web,
        },
        content: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 2,
            paddingBottom: Platform.select({
                default: BASE_DIMENSION * 10,
                ios: isIphoneXorAbove() ? BASE_DIMENSION * 11 : BASE_DIMENSION * 10
            })
        },
        headerSteps: {
            marginBottom: BASE_DIMENSION
        },

        receipientLabel: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.textSecondary
        },
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
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    });
