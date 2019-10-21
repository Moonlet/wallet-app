import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 6,
            height: 60,
            display: 'flex',
            justifyContent: 'center',
            marginHorizontal: 4,
            alignItems: 'center',
            flex: 1
        },
        conversionLabel: {
            color: theme.colors.textDarker
        },
        changeUp: {
            color: theme.colors.positive
        },
        changeDown: {
            color: theme.colors.negative
        }
    });
