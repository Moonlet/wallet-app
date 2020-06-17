import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    SCREEN_HEIGHT,
    normalize,
    isIphoneXorAbove,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

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
            paddingTop: BASE_DIMENSION * 2,
            paddingBottom: Platform.select({
                default: BASE_DIMENSION * 10,
                ios: isIphoneXorAbove() ? BASE_DIMENSION * 11 : BASE_DIMENSION * 10
            })
        },

        listContainer: {
            marginHorizontal: BASE_DIMENSION * 2
        },
        headerSteps: {
            marginBottom: BASE_DIMENSION
        },
        actionContainer: {
            marginTop: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 3,
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
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(20),
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
