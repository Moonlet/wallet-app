import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    SCREEN_HEIGHT,
    normalize,
    isIphoneXorAbove
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web,
        },
        content: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 6,
            paddingBottom: Platform.select({
                default: BASE_DIMENSION * 10,
                ios: isIphoneXorAbove() ? BASE_DIMENSION * 11 : BASE_DIMENSION * 10
            })
        },
        listContainer: {
            marginTop: BASE_DIMENSION * 3,
            marginHorizontal: BASE_DIMENSION * 2
        },
        receipientLabel: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.textSecondary
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        icon: {
            color: theme.colors.accent
        },

        //
        amountContainer: {
            flex: 1,
            marginHorizontal: BASE_DIMENSION * 2
        },

        // step 3
        confirmTransactionContainer: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 3,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        confirmTransactionText: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.textSecondary,
            alignSelf: 'center'
        },
        actionContainer: {
            marginTop: BASE_DIMENSION * 3,
            width: normalize(170),
            flexDirection: 'row',
            borderRadius: BORDER_RADIUS / 2,
            borderColor: theme.colors.accent,
            borderWidth: 1,
            justifyContent: 'center',
            alignSelf: 'center'
        },
        actionCounterText: {
            flex: 1,
            fontSize: normalize(17),
            lineHeight: normalize(20),
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: 'center',
            alignSelf: 'center'
        },
        actionIconContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            paddingVertical: BASE_DIMENSION / 2,
            paddingHorizontal: BASE_DIMENSION / 2
        },
        actionIcon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        }
    });
