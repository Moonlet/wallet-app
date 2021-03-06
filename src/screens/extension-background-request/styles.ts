import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    normalize,
    BASE_DIMENSION,
    LETTER_SPACING,
    normalizeFontAndLineHeight
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground
        },
        defaultSreenContainer: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 4,
            paddingBottom: BASE_DIMENSION * 6
        },
        unknownOpContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        unknownOpText: {
            fontSize: normalizeFontAndLineHeight(19),
            lineHeight: normalizeFontAndLineHeight(24),
            color: theme.colors.text,
            textAlign: 'center'
        },
        loadingHeaderContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: BASE_DIMENSION * 4
        },
        moonletLogo: {
            width: normalize(36),
            height: normalize(36),
            borderRadius: normalize(36),
            alignSelf: 'center',
            marginRight: BASE_DIMENSION
        },
        headerTitle: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            color: '#FFFFFF',
            alignSelf: 'center'
        }
    });
