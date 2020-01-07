import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: BASE_DIMENSION
        },
        iconContainer: {
            alignItems: 'center',
            justifyContent: 'center'
        },
        icon: {
            color: theme.colors.accent
        },
        text: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.text
        }
    });
