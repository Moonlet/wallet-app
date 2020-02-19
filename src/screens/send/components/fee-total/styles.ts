import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {},
        feeTitle: {
            fontSize: 13,
            lineHeight: 18,
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION
        },
        feeWrapper: {
            borderRadius: BORDER_RADIUS,
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
