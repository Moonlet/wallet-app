import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, ICON_CONTAINER_SIZE } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: Platform.OS === 'ios' ? BASE_DIMENSION * 5 : 0,
            justifyContent: 'center',
            backgroundColor: theme.colors.appBackground
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        iconContainer: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: BASE_DIMENSION
        },
        icon: {
            color: theme.colors.accent
        },
        loadingContainer: {
            flex: 1,
            overflow: 'hidden',
            backgroundColor: theme.colors.appBackground
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
