import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, ICON_CONTAINER_SIZE, SCREEN_HEIGHT } from '../../../styles/dimensions';
import { normalize } from '../../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme.colors.appBackground
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        iconContainer: {
            width: normalize(ICON_CONTAINER_SIZE),
            height: normalize(ICON_CONTAINER_SIZE),
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: normalize(BASE_DIMENSION)
        },
        icon: {
            color: theme.colors.accent
        },
        webviewContainer: {
            flex: 1,
            overflow: 'hidden',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web
        },
        loadingIndicator: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.colors.appBackground
        }
    });
