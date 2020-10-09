import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    SCREEN_HEIGHT,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 2,
            paddingBottom: BASE_DIMENSION,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web
        },
        qrCodeContainer: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION * 2
        },
        qrCode: {
            color: theme.colors.white,
            borderColor: theme.colors.white,
            borderWidth: BASE_DIMENSION * 2
        },
        bottomButton: {
            marginHorizontal: BASE_DIMENSION * 4
        },
        fullAddressContainer: {
            justifyContent: 'center',
            marginBottom: BASE_DIMENSION * 2
        },
        fullAddress: {
            flexShrink: 1,
            flexWrap: 'wrap',
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(20),
            letterSpacing: LETTER_SPACING,
            color: theme.colors.textTertiary,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 5
        }
    });
