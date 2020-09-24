import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, LETTER_SPACING, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingTop: BASE_DIMENSION * 6
        },
        header: {
            flexDirection: 'row'
        },
        headerTitleStyle: {
            flex: 1,
            fontSize: normalize(22),
            lineHeight: normalize(28),
            color: theme.colors.text,
            letterSpacing: LETTER_SPACING,
            textAlign: 'center',
            fontWeight: 'bold'
        }
    });
