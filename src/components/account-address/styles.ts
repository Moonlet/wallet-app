import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {},
        balanceContainer: {
            marginTop: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },
        balance: {
            fontSize: theme.fontSize.large,
            color: theme.colors.textSecondary
        },
        convert: {
            marginLeft: 5,
            fontSize: theme.fontSize.large,
            color: theme.colors.textSecondary
        },

        balanceSymbolFiat: {
            fontSize: 18,
            color: theme.colors.textSecondary,
            marginLeft: 10
        },

        address: {
            fontSize: 30,
            textAlign: 'center',
            fontWeight: 'bold'
        },
        icon: {
            color: theme.colors.accent
        }
    });
