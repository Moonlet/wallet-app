import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 0
        },
        input: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION * 2,
            fontSize: normalizeFontAndLineHeight(15)
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row'
        },
        priceLabel: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION
        },
        gasPriceUnit: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION / 2,
            marginTop: BASE_DIMENSION
        },
        displayError: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(19),
            paddingLeft: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.error
        }
    });
