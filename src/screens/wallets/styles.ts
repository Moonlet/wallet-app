import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { ph, pw } from '../../styles';
import { BASE_DIMENSION, SCREEN_HEIGHT } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: BASE_DIMENSION * 2,
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT
        },

        scrollContainer: {
            flex: 1,
            marginVertical: BASE_DIMENSION * 2
        },

        walletList: {
            flexGrow: 1,
            paddingVertical: BASE_DIMENSION * 2
        },

        bottomContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 3
        },

        buttonContainer: {
            alignSelf: 'center',
            flexDirection: 'row'
        },

        bottomButton: {
            flex: 1,
            width: 150,
            flexBasis: 0,
            marginHorizontal: BASE_DIMENSION / 2
        },

        leftActionsContainer: {
            flexDirection: 'row'
        },

        action: {
            justifyContent: 'center',
            alignItems: 'center',
            width: 72
        },

        iconActionPositive: {
            height: 40,
            color: theme.colors.accent
        },

        iconActionNegative: {
            height: 40,
            color: theme.colors.error
        },

        textActionPositive: {
            fontSize: 10,
            color: theme.colors.accent
        },

        textActionNegative: {
            fontSize: 10,
            color: theme.colors.error
        },
        emptyWalletsContainer: {
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center'
        },
        connectLedger: {
            fontSize: 22,
            lineHeight: 28,
            color: theme.colors.text,
            opacity: 0.87,
            letterSpacing: 0.35,
            fontWeight: 'bold',
            marginBottom: BASE_DIMENSION,
            textAlign: 'center'
        },
        quicklyConnectLedger: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            paddingHorizontal: BASE_DIMENSION * 4
        },
        logoImage: {
            height: ph(30),
            width: pw(60),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginBottom: BASE_DIMENSION * 6
        }
    });
