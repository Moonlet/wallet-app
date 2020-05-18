import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, isIphoneXorAbove } from '../../styles/dimensions';

const DEFAULT_BOTTOM_CONTAINER_PADDING = BASE_DIMENSION + BASE_DIMENSION / 2;

export default (theme: ITheme) =>
    StyleSheet.create({
        wrapper: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'flex-end',
            backgroundColor: theme.colors.appBackground
        },
        divider: {
            height: 1,
            width: '100%',
            backgroundColor: theme.colors.settingsDivider
        },
        container: {
            flex: 1,
            flexDirection: 'row'
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
        }
    });
