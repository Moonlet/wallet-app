import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            marginTop: BASE_DIMENSION * 3
        },
        feeTitle: {
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.primary
        },
        fee: {
            width: '100%',
            borderRadius: BORDER_RADIUS,
            paddingLeft: BASE_DIMENSION,
            lineHeight: 40,
            backgroundColor: theme.colors.primary,
            alignSelf: 'flex-start',
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
