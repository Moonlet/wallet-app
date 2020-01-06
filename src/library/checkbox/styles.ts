import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            width: '100%'
        },
        icon: {
            color: theme.colors.accent,
            paddingRight: BASE_DIMENSION,
            paddingTop: BASE_DIMENSION / 4
        },
        text: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.text,
            opacity: 0.67
        }
    });
