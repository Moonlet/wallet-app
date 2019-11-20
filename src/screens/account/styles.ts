import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.appBackground,
            paddingTop: 40,
            paddingLeft: 10,
            paddingRight: 10,
            height: 400
        },

        balanceContainer: {
            marginTop: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },

        buttonsContainer: {
            marginTop: 50,
            marginLeft: 10,
            marginRight: 10,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },

        button: {
            flex: 1,
            marginLeft: 5,
            marginRight: 5
        },

        transactionsContainer: {
            marginTop: 50
        },

        transactionsTitle: {
            fontSize: 22,
            fontWeight: 'bold'
        },
        transactionListItem: {
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            height: 44,
            marginBottom: 10,
            marginTop: 10
        },
        transactionIcon: {
            color: theme.colors.text,
            margin: 10
        },
        transactionTextContainer: {
            flex: 1,
            marginLeft: 10
        },
        transactionAmountContainer: {
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        transactionTextPrimary: {
            marginLeft: BASE_DIMENSION,
            color: theme.colors.textSecondary
        },
        transactionTextSecondary: {
            color: theme.colors.textTertiary
        },
        transactionRightIcon: {
            color: theme.colors.accent,
            margin: 14
        }
    });
