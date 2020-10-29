import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    normalize,
    BORDER_RADIUS,
    LETTER_SPACING
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION + BASE_DIMENSION / 2,
            paddingHorizontal: BASE_DIMENSION
        },
        imageContainer: {
            width: normalize(38),
            height: normalize(38),
            marginRight: BASE_DIMENSION,
            backgroundColor: theme.colors.black + '40', // 25% opacity
            borderRadius: BORDER_RADIUS,
            justifyContent: 'center',
            alignItems: 'center'
        },
        row: {
            flexDirection: 'row'
        },
        text: {
            fontSize: normalizeFontAndLineHeight(23),
            lineHeight: normalizeFontAndLineHeight(34),
            color: theme.colors.white,
            letterSpacing: LETTER_SPACING
        }
    });
