import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    SCREEN_HEIGHT,
    normalize,
    isIphoneXorAbove
} from '../../styles/dimensions';

const DEFAULT_BOTTOM_CONTAINER_PADDING = BASE_DIMENSION + BASE_DIMENSION / 2;

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web
        },
        content: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 3
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

        // bottom container
        bottomWrapper: {
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'flex-end',
            backgroundColor: theme.colors.appBackground
        },
        bottomDivider: {
            height: 1,
            width: '100%',
            backgroundColor: theme.colors.settingsDivider
        },
        bottomContainer: {
            flexDirection: 'row',
            justifyContent: 'center'
        },
        buttonContainer: {
            paddingRight: DEFAULT_BOTTOM_CONTAINER_PADDING,
            paddingTop: DEFAULT_BOTTOM_CONTAINER_PADDING,
            paddingBottom: Platform.select({
                default: DEFAULT_BOTTOM_CONTAINER_PADDING,
                ios: isIphoneXorAbove() ? BASE_DIMENSION * 3 : DEFAULT_BOTTOM_CONTAINER_PADDING
            })
        },
        bottomTextContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            paddingRight: BASE_DIMENSION * 2,
            paddingLeft: BASE_DIMENSION + BASE_DIMENSION / 2,
            paddingTop: BASE_DIMENSION / 4
        },
        bottomDefaultText: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.text
        },
        bottomSendText: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.accent,
            marginRight: BASE_DIMENSION / 2
        },
        bottomToText: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.text,
            marginRight: BASE_DIMENSION / 2
        },
        bottomAmountText: {
            fontSize: normalize(11),
            lineHeight: normalize(13),
            color: theme.colors.textTertiary
        },
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
        }
    });
