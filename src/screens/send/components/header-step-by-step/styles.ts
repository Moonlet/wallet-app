import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalize,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: BASE_DIMENSION * 2
        },
        headerRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION
        },
        headerDescription: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: BASE_DIMENSION
        },
        circle: {
            flexDirection: 'column',
            justifyContent: 'center',
            height: normalize(40),
            width: normalize(40),
            borderRadius: normalize(20),
            backgroundColor: theme.colors.textTertiary
        },
        circleSelected: {
            backgroundColor: theme.colors.accentSecondary
        },
        number: {
            fontSize: normalizeFontAndLineHeight(19),
            lineHeight: normalizeFontAndLineHeight(24),
            textAlign: 'center',
            color: theme.colors.textSecondary
        },
        numberSelected: {
            color: theme.colors.accent
        },
        divider: {
            height: 2,
            alignSelf: 'center',
            backgroundColor: theme.colors.textTertiary
        },
        dividerSelected: {
            backgroundColor: theme.colors.accentSecondary
        },
        text: {
            fontSize: normalizeFontAndLineHeight(11),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.text,
            textAlign: 'center'
        }
    });
