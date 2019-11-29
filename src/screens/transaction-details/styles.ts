import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingTop: 24,
            paddingBottom: BASE_DIMENSION * 2,
            paddingLeft: BASE_DIMENSION * 2,
            paddingRight: BASE_DIMENSION * 2,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground
        },
        rowContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: BASE_DIMENSION
        },
        icon: {
            color: theme.colors.accent,
            marginHorizontal: 0,
            alignSelf: 'center'
        },
        textPrimary: {
            fontSize: theme.fontSize.regular,
            alignItems: 'center',
            flex: 1,
            lineHeight: BASE_DIMENSION * 3
        },
        textSecondary: {
            fontSize: theme.fontSize.regular,
            color: theme.colors.textSecondary,
            alignItems: 'center',
            lineHeight: BASE_DIMENSION * 3
        }
    });
