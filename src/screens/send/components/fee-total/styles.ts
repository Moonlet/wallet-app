import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {},
        feeTitle: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
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
            fontSize: normalize(16),
            lineHeight: normalize(21)
        },
        approxSign: {
            color: theme.colors.textSecondary
        },
        feeConverted: {
            color: theme.colors.textSecondary,
            fontSize: normalize(12),
            lineHeight: normalize(17)
        },
        containerFeeConverted: {
            paddingLeft: BASE_DIMENSION * 2,
            flexDirection: 'row',
            alignItems: 'baseline'
        }
    });
