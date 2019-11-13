import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            padding: BASE_DIMENSION * 2,
            ...StyleSheet.absoluteFillObject
        },

        walletList: {
            marginTop: 32
        },

        bottomContainer: {
            alignSelf: 'center',
            marginBottom: 20,
            flexDirection: 'row',
            flex: 0
        },

        buttonContainer: {
            alignSelf: 'center',
            flexDirection: 'row'
        },

        bottomButton: {
            flex: 1,
            flexBasis: 0,
            marginHorizontal: BASE_DIMENSION / 2
        },

        walletCard: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: 80,
            padding: BASE_DIMENSION * 2,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            marginBottom: BASE_DIMENSION,
            borderWidth: 1,
            borderColor: theme.colors.cardBackground
        },

        selectedWallet: {
            borderColor: theme.colors.accent
        },

        iconWallet: {
            color: theme.colors.accent,
            marginRight: BASE_DIMENSION * 2
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
        }
    });
