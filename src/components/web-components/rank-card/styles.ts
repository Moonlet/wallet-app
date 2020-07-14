import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.rankCard,
            marginRight: '16.84%',
            marginLeft: '16.84%',
            marginTop: 37,
            height: 67,
            flexDirection: 'row',
            borderRadius: 6
        },
        column: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            fontSize: 16,
            fontWeight: 'normal',
            fontStyle: 'normal',
            lineHeight: 21,
            color: theme.colors.textSecondary
        },
        value: {
            fontSize: 22,
            fontWeight: 'bold',
            fontStyle: 'normal',
            lineHeight: 28,
            color: theme.colors.text
        },
        reward: {
            color: theme.colors.positive
        }
    });
