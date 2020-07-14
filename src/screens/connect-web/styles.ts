import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground
        },
        headerContainer: {
            flexDirection: 'row',
            height: 50,
            backgroundColor: 'blue'
        }
    });
