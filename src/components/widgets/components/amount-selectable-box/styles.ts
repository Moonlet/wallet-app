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
            //
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
            flexDirection: 'row'
        },
        amountComp: {
            flex: 1,
            borderRadius: BORDER_RADIUS / 2,
            borderWidth: 1,
            borderColor: theme.colors.textTertiary,
            paddingVertical: BASE_DIMENSION,
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
