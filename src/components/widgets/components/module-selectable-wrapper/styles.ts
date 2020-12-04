import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.cardBackground,
            borderWidth: 2,
            borderRadius: BORDER_RADIUS,
            marginBottom: BASE_DIMENSION
        },
        moduleColWrapperContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    });
