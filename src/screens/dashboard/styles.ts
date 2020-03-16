import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            height: Platform.OS === 'web' ? 'calc(100vh - 122px)' : 'auto'
        },
        coinBalanceCard: {
            paddingTop: BASE_DIMENSION * 4,
            paddingBottom: BASE_DIMENSION * 6
        },
        dashboardContainer: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        selectorGradientContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: 70, // used for 20px
            bottom: 0,
            justifyContent: 'flex-end'
        },
        blockchainSelectorContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 20,
            height: 40,
            flexDirection: 'row',
            marginBottom: 12,
            marginHorizontal: BASE_DIMENSION * 2,
            overflow: 'hidden'
        },
        blockchainButton: {
            flex: 1,
            flexBasis: 0,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 16,
            margin: BASE_DIMENSION / 2
        },
        blockchainButtonActive: {
            backgroundColor: theme.colors.textTertiary
        },
        blockchainButtonTextActive: {
            fontSize: 16,
            lineHeight: 18,
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
        }
    });
