import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../../../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../../../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexGrow: 1,
            backgroundColor: theme.colors.appBackground
        },
        text: {
            fontWeight: 'bold',
            fontSize: normalize(22),
            lineHeight: normalize(28),
            textAlign: 'center',
            letterSpacing: 0.35,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION * 2
        }
    });
