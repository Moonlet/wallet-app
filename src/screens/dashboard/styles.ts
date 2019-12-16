import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground
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
        },
        header: {
            backgroundColor: theme.colors.cardBackground,
            shadowColor: '#000000',
            paddingTop: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            width: '100%'
        },
        panelHeader: {
            alignItems: 'center'
        },
        panelHandle: {
            width: 40,
            height: 8,
            borderRadius: BORDER_RADIUS,
            backgroundColor: '#00000040',
            marginBottom: BASE_DIMENSION
        },
        panelContent: {
            flex: 1,
            backgroundColor: theme.colors.cardBackground
            // height: 600
        },
        panelContainer: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        }
    });
