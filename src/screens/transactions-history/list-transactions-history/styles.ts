import { StyleSheet } from 'react-native';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../../styles/dimensions';
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
            borderRadius: BORDER_RADIUS,
            marginBottom: BASE_DIMENSION
        },
        transactionIconContainer: {
            justifyContent: 'center',
            marginRight: BASE_DIMENSION
        },
        transactionIcon: {
            alignSelf: 'center'
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
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.text
        },
        transactionTextSecondary: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
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
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            textAlign: 'center',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION
        },
        transactionHistoryText: {
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textTertiary,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 2
        },
        transactionListItemPending: {
            backgroundColor: theme.colors.cardBackground,
            paddingVertical: BASE_DIMENSION * 2
        },
        transactionListItemOthers: {
            backgroundColor: theme.colors.appBackground,
            paddingVertical: BASE_DIMENSION
        }
    });
