import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            borderWidth: 1,
            borderColor: theme.colors.accent,
            flexDirection: 'row',
            width: '100%',
            height: 40
        },

        tabButton: {
            borderWidth: 1,
            borderColor: theme.colors.accent,
            flexBasis: 0,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        tabButtonText: {},
        tabButtonSelected: {
            backgroundColor: theme.colors.accent
        },
        tabButtonTextSelected: {
            color: theme.colors.appBackground
        }
    });
