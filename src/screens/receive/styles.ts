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
            padding: BASE_DIMENSION * 2,
            paddingTop: BASE_DIMENSION * 4,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web
        },
        content: {
            flex: 1,
            justifyContent: 'center'
        },
        qrCodeContainer: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION * 2
        },
        qrCode: {
            padding: BASE_DIMENSION * 2,
            backgroundColor: '#FFFFFF'
        },
        bottomButton: {
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 3
        },
        fullAddressContainer: {
            justifyContent: 'center',
            marginBottom: BASE_DIMENSION * 2
        },
        fullAddress: {
            flexShrink: 1,
            flexWrap: 'wrap',
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            letterSpacing: LETTER_SPACING,
            color: theme.colors.textTertiary,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 5
        }
    });
