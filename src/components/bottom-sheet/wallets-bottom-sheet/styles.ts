import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.bottomSheetBackground,
            padding: BASE_DIMENSION * 2
        },
        scrollContainer: {
            flexGrow: 1,
            backgroundColor: theme.colors.bottomSheetBackground,
            marginBottom: BASE_DIMENSION * 4
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        firstRow: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION / 4
        },
        accountName: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            fontWeight: '500',
            letterSpacing: 0.38,
            color: theme.colors.text,
            marginRight: BASE_DIMENSION
        },
        accountAddress: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            fontWeight: '500',
            letterSpacing: 0.38,
            color: theme.colors.accent
        },
        fistAmountText: {
            color: theme.colors.textSecondary
        },
        secondAmountText: {
            marginLeft: BASE_DIMENSION,
            color: theme.colors.textSecondary
        }
    });
