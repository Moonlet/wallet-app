import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { normalize } from '../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: normalize(BASE_DIMENSION * 2)
        },
        icon: {
            color: theme.colors.accent
        }
    });
