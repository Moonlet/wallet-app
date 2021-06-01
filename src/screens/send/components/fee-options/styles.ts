import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    LETTER_SPACING,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginBottom: BASE_DIMENSION
        },
        buttonRightOptions: {
            alignItems: 'flex-end',
            alignSelf: 'center'
        },
        textTranferButton: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.accent
        },
        list: {
            flexGrow: 1,
            justifyContent: 'flex-start'
        },
        displayErrorFees: {
            flex: 1,
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(19),
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.error
        },
        retryButton: {
            marginHorizontal: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION * 2,
            alignSelf: 'center',
            width: '50%'
        },
        retryContainer: {
            flex: 1,
            alignContent: 'center'
        },
        retryText: {
            fontSize: normalizeFontAndLineHeight(20),
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            textAlign: 'center',
            color: theme.colors.text,
            marginTop: BASE_DIMENSION * 8,
            marginBottom: BASE_DIMENSION
        },
        retrySubtitleText: {
            fontSize: normalizeFontAndLineHeight(15),
            letterSpacing: LETTER_SPACING,
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION
        }
    });
