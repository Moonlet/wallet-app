import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BORDER_RADIUS, normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: 'transparent'
        },
        barContainer: {
            height: normalize(20),
            width: '100%',
            backgroundColor: theme.colors.black,
            borderRadius: BORDER_RADIUS / 2
        },
        progressBar: {
            height: normalize(20),
            backgroundColor: theme.colors.accent,
            borderRadius: BORDER_RADIUS / 2
        }
    });
