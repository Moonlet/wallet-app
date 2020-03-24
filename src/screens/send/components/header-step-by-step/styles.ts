import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../../../styles/dimensions';

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
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.textTertiary
        },
        circleSelected: {
            backgroundColor: theme.colors.accentSecondary
        },
        number: {
            fontSize: normalize(19),
            lineHeight: normalize(24),
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
            fontSize: normalize(11),
            lineHeight: normalize(13),
            color: theme.colors.text,
            textAlign: 'center'
        }
    });
