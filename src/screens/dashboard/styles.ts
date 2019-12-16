import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        coinBalanceCard: {
            paddingTop: BASE_DIMENSION * 4,
            paddingBottom: BASE_DIMENSION * 6
        },
        dashboardContainer: {
            flex: 1
        },
        selectorGradientContainer: {
            position: 'absolute',
            flex: 1,
            left: 0,
            right: 0,
            height: 100,
            bottom: 0,
            zIndex: 1,
            opacity: 0.87,
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
            backgroundColor: theme.colors.primary
        },
        blockchainButtonTextActive: {
            color: theme.colors.accent
        },
        coinDashboard: {
            flex: 1,
            alignSelf: 'stretch'
        }
    });
