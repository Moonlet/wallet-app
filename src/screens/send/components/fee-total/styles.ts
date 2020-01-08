import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {},
        feeTitle: {
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.textSecondary
        },
        feeWrapper: {
            borderRadius: BORDER_RADIUS,
            borderWidth: 1,
            backgroundColor: theme.colors.cardBackground,
            paddingLeft: BASE_DIMENSION * 2,
            paddingVertical: BASE_DIMENSION
        },
        fee: {
            color: theme.colors.textSecondary,
            fontSize: 16,
            lineHeight: 21
        },
        approxSign: {
            color: theme.colors.textSecondary
        },
        feeConverted: {
            color: theme.colors.textSecondary,
            fontSize: theme.fontSize.small
        },
        containerFeeConverted: {
            paddingLeft: BASE_DIMENSION * 2,
            flexDirection: 'row',
            alignItems: 'baseline'
        }
    });
