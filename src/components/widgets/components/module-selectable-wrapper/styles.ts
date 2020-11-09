import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../../../styles/dimensions';

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
        },
        infoWrapper: {
            top: 0,
            position: 'absolute',
            width: normalize(40),
            height: normalize(40),
            justifyContent: 'center'
        }
    });
