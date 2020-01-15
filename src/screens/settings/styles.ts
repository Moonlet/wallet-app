import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: BASE_DIMENSION * 2,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: Platform.OS === 'web' ? 'calc(100vh - 122px)' : 'auto'
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION * 2,
            alignItems: 'center'
        },
        textHeader: {
            color: theme.colors.textSecondary,
            fontSize: 13,
            lineHeight: 18,
            marginTop: BASE_DIMENSION * 2
        },
        textRow: {
            flex: 1,
            fontSize: 17,
            lineHeight: 21,
            letterSpacing: 0.38,
            color: theme.colors.text
        },
        rightValue: {
            fontSize: 15,
            lineHeight: 20,
            color: theme.colors.textTertiary,
            paddingRight: BASE_DIMENSION
        },
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: theme.colors.settingsDivider
        },
        rightContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center'
        },
        icon: {
            color: theme.colors.accent
        },
        button: {
            margin: BASE_DIMENSION * 3
        }
    });
