import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, ICON_CONTAINER_SIZE } from '../../styles/dimensions';
import { normalize } from '../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        button: {
            marginRight: BASE_DIMENSION,
            flexDirection: 'row',
            alignItems: 'center'
        },
        iconContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE
        },
        icon: {
            color: theme.colors.accent
        },
        text: {
            lineHeight: normalize(22),
            color: theme.colors.text
        }
    });
