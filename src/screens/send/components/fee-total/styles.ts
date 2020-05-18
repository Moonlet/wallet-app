import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {},
        feeTitle: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION * 2
        },
        feeWrapper: {
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.cardBackground,
            paddingLeft: BASE_DIMENSION * 2,
            paddingVertical: BASE_DIMENSION
        },
        fee: {
            color: theme.colors.textSecondary,
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(21)
        },
        approxSign: {
            color: theme.colors.textSecondary
        },
        feeConverted: {
            color: theme.colors.textSecondary,
            fontSize: normalizeFontAndLineHeight(12),
            lineHeight: normalizeFontAndLineHeight(17)
        },
        containerFeeConverted: {
            paddingLeft: BASE_DIMENSION * 2,
            flexDirection: 'row',
            alignItems: 'baseline'
        }
    });
