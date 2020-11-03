import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    BORDER_RADIUS,
    LETTER_SPACING
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION + BASE_DIMENSION / 2,
            paddingLeft: BASE_DIMENSION * 2
        },
        row: {
            flexDirection: 'row'
        },
        textContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center'
        },
        mainText: {
            fontSize: normalizeFontAndLineHeight(34),
            lineHeight: normalizeFontAndLineHeight(41),
            color: theme.colors.white,
            letterSpacing: LETTER_SPACING
        },
        secondaryText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.white
        },
        icon: {
            color: theme.colors.white,
            alignSelf: 'center'
        }
    });
