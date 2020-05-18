import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight
} from '../../../styles/dimensions';

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
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textSecondary,
            marginTop: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 5,
            textAlign: 'center'
        },
        scanningDevices: {
            lineHeight: normalizeFontAndLineHeight(22),
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
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.text
        },
        pairedText: {
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.accent
        },
        deviceId: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
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
