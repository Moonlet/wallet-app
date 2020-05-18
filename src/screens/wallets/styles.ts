import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { ph, pw } from '../../styles';
import {
    BASE_DIMENSION,
    SCREEN_HEIGHT,
    normalize,
    normalizeFontAndLineHeight
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: BASE_DIMENSION * 2,
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web
        },
        scrollContainer: {
            flex: 1,
            marginVertical: BASE_DIMENSION * 2
        },
        walletList: {
            flexGrow: 1,
            paddingVertical: BASE_DIMENSION * 2
        },
        buttonContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 3
        },
        bottomButton: {
            marginHorizontal: BASE_DIMENSION / 2
        },
        leftActionsContainer: {
            flexDirection: 'row'
        },
        action: {
            justifyContent: 'center',
            alignItems: 'center',
            width: normalize(72)
        },
        iconActionPositive: {
            height: normalize(40),
            color: theme.colors.accent
        },
        iconActionNegative: {
            height: normalize(40),
            color: theme.colors.error
        },
        textActionPositive: {
            fontSize: normalizeFontAndLineHeight(10),
            color: theme.colors.accent
        },
        textActionNegative: {
            fontSize: normalizeFontAndLineHeight(10),
            color: theme.colors.error
        },
        emptyWalletsContainer: {
            flex: 1,
            alignSelf: 'center',
            justifyContent: 'center'
        },
        connectLedger: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.text,
            letterSpacing: 0.35,
            fontWeight: 'bold',
            marginBottom: BASE_DIMENSION,
            textAlign: 'center'
        },
        quicklyConnectLedger: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
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
