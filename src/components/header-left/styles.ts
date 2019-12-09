import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { ICON_CONTAINER_SIZE } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        button: {
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
            fontSize: 17,
            lineHeight: 22,
            opacity: 0.87,
            color: theme.colors.text
        }
    });
