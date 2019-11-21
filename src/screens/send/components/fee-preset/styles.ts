import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            margin: BASE_DIMENSION,
            backgroundColor: theme.colors.cardBackground,
            alignItems: 'center',
            flex: 1
        },
        containerSelected: {
            backgroundColor: theme.colors.text
        },
        fee: {
            color: theme.colors.textSecondary
        },
        feeConverted: {
            color: theme.colors.textSecondary,
            fontSize: theme.fontSize.small
        },
        containerFeeConverted: {
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        feeTitle: {
            color: theme.colors.textSecondary
        }
    });
