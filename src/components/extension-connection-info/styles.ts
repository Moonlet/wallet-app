import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: '#fc783a',
            width: '100%'
        },
        text: {
            fontSize: 16,
            lineHeight: 21,
            color: theme.colors.gradientDark,
            textAlign: 'center'
        }
    });
