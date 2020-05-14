import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground
        },
        coinBalanceCard: {
            backgroundColor: theme.colors.appBackground,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            justifyContent: 'center'
        },
        dashboardContainer: {
            flexGrow: 1,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        selectorGradientContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: normalize(70), // used for 20px
            bottom: 0,
            justifyContent: 'flex-end'
        },
        blockchainSelectorContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: normalize(20),
            height: normalize(40),
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION + BASE_DIMENSION / 2,
            marginHorizontal: BASE_DIMENSION * 2,
            overflow: 'hidden'
        },
        blockchainButton: {
            flex: 1,
            flexBasis: 0,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: normalize(16),
            margin: BASE_DIMENSION / 2
        },
        blockchainButtonActive: {
            backgroundColor: theme.colors.textTertiary
        },
        blockchainButtonTextActive: {
            lineHeight: normalize(18),
            color: theme.colors.accent
        },
        coinDashboard: {
            flex: 1
        },
        expandIconContainer: {
            marginRight: BASE_DIMENSION * 2,
            justifyContent: 'center'
        },
        expandIcon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        },
        bottomBlockchainContainer: {
            flex: 1,
            flexDirection: 'row'
        },
        darkerText: {
            color: theme.colors.textSecondary
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        rowContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION,
            justifyContent: 'center'
        },
        account: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.text,
            marginRight: BASE_DIMENSION
        },
        address: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.accent
        },
        mainText: {
            fontWeight: 'bold',
            letterSpacing: 0.4,
            color: theme.colors.textSecondary,
            marginRight: BASE_DIMENSION * 2
        },
        secondaryText: {
            fontSize: normalize(16),
            color: theme.colors.textSecondary
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.accent,
            fontWeight: 'bold'
        }
    });
