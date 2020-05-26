import { StyleSheet } from 'react-native';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../../../../../../styles/dimensions';
import { ITheme } from '../../../../../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingHorizontal: BASE_DIMENSION,
            marginTop: BASE_DIMENSION * 3,
            paddingBottom: BASE_DIMENSION * 5
        },
        text: {
            fontWeight: 'bold',
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            textAlign: 'center',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION * 2
        },
        bottomContainer: {
            marginTop: BASE_DIMENSION * 3,
            marginHorizontal: BASE_DIMENSION * 2
        },
        buttonsRowContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2,
            marginHorizontal: -BASE_DIMENSION / 2 // used to remove horizontal margins from buttons
        },
        button: {
            marginHorizontal: BASE_DIMENSION / 2
        }
    });
