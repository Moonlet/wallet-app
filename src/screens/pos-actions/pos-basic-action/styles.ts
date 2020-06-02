import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    SCREEN_HEIGHT,
    isIphoneXorAbove,
    normalizeFontAndLineHeight
} from '../../../styles/dimensions';

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
        amountContainer: {
            marginHorizontal: BASE_DIMENSION * 2
        },

        unlockContainerText: {
            textAlign: 'center'
        },
        unlockTextChildren: {
            color: theme.colors.textSecondary,
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(18)
        },
        bottomText: {
            color: theme.colors.textSecondary,
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(16),
            marginHorizontal: BASE_DIMENSION * 2
        }
    });
