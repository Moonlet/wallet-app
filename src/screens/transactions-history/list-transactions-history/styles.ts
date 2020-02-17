import { StyleSheet } from 'react-native';
import { BASE_DIMENSION } from '../../../styles/dimensions';
import { ITheme } from '../../../core/theme/itheme';
import { ph, pw } from '../../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        transactionsContainer: {
            flex: 1,
            padding: BASE_DIMENSION * 2
        },
        transactionListItem: {
            flexDirection: 'row',
            paddingHorizontal: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION * 3
        },
        transactionIcon: {
            color: theme.colors.text,
            alignSelf: 'center',
            marginRight: BASE_DIMENSION
        },
        transactionTextContainer: {
            flex: 1,
            marginLeft: BASE_DIMENSION
        },
        transactionAmountContainer: {
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        transactionTextPrimary: {
            fontSize: 17,
            lineHeight: 21,
            color: theme.colors.text,
            opacity: 0.87
        },
        transactionTextSecondary: {
            fontSize: 15,
            lineHeight: 20,
            color: theme.colors.textTertiary
        },
        transactionRightIcon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        emptySection: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center'
        },
        logoImage: {
            height: ph(20),
            width: pw(50),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginBottom: BASE_DIMENSION * 2
        },
        noTransactionsText: {
            fontWeight: 'bold',
            fontSize: 22,
            lineHeight: 28,
            textAlign: 'center',
            letterSpacing: 0.35,
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION
        },
        transactionHistoryText: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.textTertiary,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 2
        }
    });
