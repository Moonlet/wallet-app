import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, ICON_CONTAINER } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        button: {
            marginLeft: BASE_DIMENSION * 2,
            flexDirection: 'row',
            alignItems: 'center'
        },
        iconContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            height: ICON_CONTAINER,
            width: ICON_CONTAINER
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
