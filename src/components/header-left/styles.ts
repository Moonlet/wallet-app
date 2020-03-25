import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, ICON_CONTAINER_SIZE, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
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
        text: {
            lineHeight: normalize(22),
            color: theme.colors.text
        }
    });
