import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    isIphoneXorAbove
} from '../../../../styles/dimensions';

const DEFAULT_BOTTOM_CONTAINER_PADDING = BASE_DIMENSION + BASE_DIMENSION / 2;

export default (theme: ITheme) =>
    StyleSheet.create({
        // bottom container
        bottomWrapper: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
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
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.text
        },
        bottomSendText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.accent,
            marginRight: BASE_DIMENSION / 2
        },
        bottomToText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.text,
            marginRight: BASE_DIMENSION / 2
        },
        bottomAmountText: {
            fontSize: normalizeFontAndLineHeight(11),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.textTertiary
        }
    });
