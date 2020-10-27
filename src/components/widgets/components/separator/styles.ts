import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        separator: {
            height: 1,
            flex: 1,
            backgroundColor: theme.colors.inputBackground,
            marginVertical: BASE_DIMENSION * 2
        }
    });
