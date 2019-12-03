import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, ICON_CONTAINER_SIZE } from '../../styles/dimensions';

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
            paddingHorizontal: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION * 6
        },

        transactionsTitle: {
            fontSize: 22,
            lineHeight: 28,
            color: theme.colors.text,
            opacity: 0.87,
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
        }
    });
