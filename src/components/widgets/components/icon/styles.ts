import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        icon: {
            alignSelf: 'center',
            color: theme.colors.textTertiary,
            padding: BASE_DIMENSION
        }
    });
