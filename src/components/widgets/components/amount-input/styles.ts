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
        },
        amountsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION
        },
        amountComp: {
            flex: 1,
            borderRadius: BORDER_RADIUS / 2,
            borderWidth: 1,
            borderColor: theme.colors.textTertiary,
            paddingVertical: BASE_DIMENSION / 2,
            marginHorizontal: BASE_DIMENSION / 2
        },
        amountCompSelected: {
            borderColor: theme.colors.accent
        },
        amountCompText: {
            fontSize: normalizeFontAndLineHeight(16),
            textAlign: 'center',
            color: theme.colors.textTertiary
        },
        amountCompTextSelected: {
            color: theme.colors.accent
        }
    });
