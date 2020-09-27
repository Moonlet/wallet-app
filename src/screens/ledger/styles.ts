import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { LETTER_SPACING, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground
        },
        header: {
            flexDirection: 'row',
            width: '100%'
        },
        defaultHeaderContainer: {
            flex: 1
        },
        headerTitleContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        headerTitleStyle: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.text,
            letterSpacing: LETTER_SPACING,
            textAlign: 'center',
            fontWeight: 'bold'
        }
    });
