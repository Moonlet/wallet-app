import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, ICON_CONTAINER_SIZE } from '../../styles/dimensions';
import { ph, pw } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingTop: BASE_DIMENSION * 5,
            paddingHorizontal: BASE_DIMENSION
        },

        balanceContainer: {
            marginTop: BASE_DIMENSION,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },

        buttonsContainer: {
            marginTop: BASE_DIMENSION * 8,
            marginHorizontal: BASE_DIMENSION,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },

        button: {
            flex: 1,
            marginHorizontal: BASE_DIMENSION / 2
        },

        transactionsContainer: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION * 6
        },

        transactionsTitle: {
            fontSize: 22,
            lineHeight: 28,
            color: theme.colors.text,
            fontWeight: 'bold'
        },

        transactionListItem: {
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
            height: ICON_CONTAINER_SIZE,
            marginBottom: BASE_DIMENSION,
            marginTop: BASE_DIMENSION
        },
        transactionIcon: {
            color: theme.colors.text,
            margin: BASE_DIMENSION
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
            marginLeft: BASE_DIMENSION,
            color: theme.colors.textSecondary
        },
        transactionTextSecondary: {
            color: theme.colors.textTertiary
        },
        transactionRightIcon: {
            color: theme.colors.accent,
            margin: 14
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
            marginBottom: BASE_DIMENSION * 3
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
