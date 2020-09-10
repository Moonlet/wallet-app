import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: theme.colors.positiveSecondary,
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION,
            paddingLeft: BASE_DIMENSION * 2
        },
        textContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center'
        },
        mainText: {
            fontSize: normalizeFontAndLineHeight(34),
            lineHeight: normalizeFontAndLineHeight(41),
            color: '#FFFFFF',
            letterSpacing: LETTER_SPACING
        },
        secondaryText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: '#FFFFFF'
        },
        icon: {
            color: '#FFFFFF',
            alignSelf: 'center'
        }
    });
