import { StyleSheet } from 'react-native';
import { BASE_DIMENSION, normalize } from '../../../styles/dimensions';
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
            lineHeight: normalize(21),
            color: theme.colors.text
        },
        transactionTextSecondary: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
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
            fontSize: normalize(22),
            lineHeight: normalize(28),
            textAlign: 'center',
            letterSpacing: 0.35,
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION
        },
        transactionHistoryText: {
            lineHeight: normalize(22),
            color: theme.colors.textTertiary,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 2
        }
    });
