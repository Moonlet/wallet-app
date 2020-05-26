import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../../../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground
        },
        text: {
            fontWeight: 'bold',
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            textAlign: 'center',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION * 2
        }
    });
