import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            justifyContent: 'flex-start',
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            padding: 10
        }
    });
