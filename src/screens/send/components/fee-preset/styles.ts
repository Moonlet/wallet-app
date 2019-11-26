import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            margin: BASE_DIMENSION,
            backgroundColor: theme.colors.cardBackground,
            alignItems: 'center',
            paddingVertical: BASE_DIMENSION,
            paddingHorizontal: BASE_DIMENSION
        },
        containerSelected: {
            backgroundColor: theme.colors.text
        },
        fee: {
            fontSize: 16,
            lineHeight: 21,
            color: theme.colors.textSecondary
        },
        feeConverted: {
            color: theme.colors.textSecondary,
            fontSize: theme.fontSize.small,
            lineHeight: 19
        },
        containerFeeConverted: {
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        feeTitle: {
            fontSize: 16,
            lineHeight: 25,
            color: theme.colors.textSecondary
        }
    });
