import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        icon: {
            alignSelf: 'center',
            color: theme.colors.textTertiary
        }
    });
