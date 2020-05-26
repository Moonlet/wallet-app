import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            alignSelf: 'center',
            alignItems: 'center'
        },
        darkerText: {
            color: theme.colors.textSecondary
        },
        rowContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION
        },
        account: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.text,
            marginRight: BASE_DIMENSION
        },
        address: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.accent
        },
        mainText: {
            fontSize: normalizeFontAndLineHeight(30),
            lineHeight: normalizeFontAndLineHeight(41),
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            marginRight: BASE_DIMENSION * 2
        },
        secondaryText: {
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.textSecondary
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.accent,
            fontWeight: 'bold'
        }
    });
