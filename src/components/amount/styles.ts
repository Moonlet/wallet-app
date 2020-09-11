import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        smallToken: {
            color: theme.colors.white
        }
    });
