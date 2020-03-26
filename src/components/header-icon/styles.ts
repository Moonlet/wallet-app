import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: BASE_DIMENSION
        },
        icon: {
            color: theme.colors.accent
        }
    });
