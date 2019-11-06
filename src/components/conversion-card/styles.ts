import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 6,
            height: 60,
            display: 'flex',
            justifyContent: 'center',
            marginHorizontal: BASE_DIMENSION / 2,
            alignItems: 'center',
            flex: 1
        },
        conversionLabel: {
            color: theme.colors.textSecondary
        },
        changeUp: {
            color: theme.colors.positive
        },
        changeDown: {
            color: theme.colors.negative
        }
    });
