import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            height: 22,
            width: '100%',
            backgroundColor: theme.colors.warning
        },
        text: {
            fontSize: 16,
            lineHeight: 21,
            color: theme.colors.gradientDark,
            textAlign: 'center'
        }
    });
