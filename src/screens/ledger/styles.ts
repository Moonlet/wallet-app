import { Platform, StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    isIphoneXorAbove,
    LETTER_SPACING,
    normalizeFontAndLineHeight
} from '../../styles/dimensions';

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
        header: {
            flexDirection: 'row',
            width: '100%'
        },
        defaultHeaderContainer: {
            flex: 1
        },
        headerTitleContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        headerTitleStyle: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.text,
            letterSpacing: LETTER_SPACING,
            textAlign: 'center',
            fontWeight: 'bold'
        }
    });
