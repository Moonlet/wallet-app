import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        }
    });
