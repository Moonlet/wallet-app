import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        content: {
            backgroundColor: theme.colors.bottomSheetBackground,
            paddingHorizontal: BASE_DIMENSION * 3,
            paddingVertical: BASE_DIMENSION * 2
        },

        scanningContainer: {
            flex: 1
        },
        message: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.textSecondary,
            marginTop: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 5,
            textAlign: 'center'
        },
        scanningDevices: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.textSecondary,
            paddingTop: BASE_DIMENSION * 4,
            marginBottom: BASE_DIMENSION * 5,
            textAlign: 'center'
        },
        deviceRow: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 3,
            paddingHorizontal: BASE_DIMENSION,
            justifyContent: 'center'
        },
        deviceDetails: {
            flex: 1,
            flexDirection: 'column'
        },
        deviceName: {
            fontSize: 16,
            lineHeight: 21,
            color: theme.colors.text
        },
        pairedText: {
            fontSize: 16,
            lineHeight: 21,
            color: theme.colors.accent
        },
        deviceId: {
            fontSize: 13,
            lineHeight: 18,
            color: theme.colors.textSecondary
        },
        deviceIcon: {
            alignSelf: 'center',
            color: theme.colors.textSecondary
        },
        deviceIconPaired: {
            color: theme.colors.accent
        },
        deviceIconBackground: {
            justifyContent: 'center',
            height: BASE_DIMENSION * 5,
            backgroundColor: theme.colors.appBackground,
            padding: BASE_DIMENSION,
            marginRight: BASE_DIMENSION * 2,
            borderRadius: BORDER_RADIUS
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.accent
        }
    });
