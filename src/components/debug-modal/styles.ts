import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            padding: BASE_DIMENSION * 3
        },
        row: {
            flexDirection: 'column',
            marginBottom: BASE_DIMENSION * 2
        },
        button: {
            marginVertical: BASE_DIMENSION * 2
        }
    });
