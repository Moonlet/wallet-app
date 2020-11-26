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
            backgroundColor: 'transparent',
            paddingHorizontal: BASE_DIMENSION * 2
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row'
        },
        inputText: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION * 2,
            fontSize: normalizeFontAndLineHeight(15)
        },
        row: {
            flexDirection: 'row'
        },
        label: {
            fontSize: normalizeFontAndLineHeight(14),
            color: theme.colors.textSecondary
        },
        amountText: {
            fontSize: normalizeFontAndLineHeight(14),
            color: theme.colors.accent
        },
        warningText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(19),
            color: theme.colors.warning,
            marginTop: BASE_DIMENSION / 2
        },
        errorText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(19),
            color: theme.colors.error,
            marginTop: BASE_DIMENSION / 2
        }
    });
