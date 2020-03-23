import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { normalize } from '../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            height: Platform.OS === 'web' ? 'calc(100vh - 122px)' : 'auto'
        },
        coinBalanceCard: {
            paddingTop: normalize(BASE_DIMENSION * 4),
            paddingBottom: normalize(BASE_DIMENSION * 6)
        },
        dashboardContainer: {
            flex: 1,
            paddingHorizontal: normalize(BASE_DIMENSION * 2)
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
            borderRadius: 20,
            height: normalize(40),
            flexDirection: 'row',
            marginBottom: normalize(BASE_DIMENSION + BASE_DIMENSION / 2),
            marginHorizontal: normalize(BASE_DIMENSION * 2),
            overflow: 'hidden'
        },
        blockchainButton: {
            flex: 1,
            flexBasis: 0,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 16,
            margin: normalize(BASE_DIMENSION / 2)
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
            marginRight: normalize(BASE_DIMENSION * 2),
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
