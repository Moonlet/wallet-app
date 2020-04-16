import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: Platform.OS === 'web' ? 'calc(100vh - 122px)' : 'auto'
        },
        scrollContainer: {
            flexGrow: 1,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION * 2,
            alignItems: 'center'
        },
        colContainer: {
            flexDirection: 'column',
            paddingVertical: BASE_DIMENSION * 2
        },
        textHeader: {
            color: theme.colors.textSecondary,
            fontSize: normalize(13),
            lineHeight: normalize(18),
            marginTop: BASE_DIMENSION * 2
        },
        textRow: {
            flex: 1,
            fontSize: normalize(17),
            lineHeight: normalize(21),
            letterSpacing: 0.38,
            color: theme.colors.text
        },
        textRowMargin: {
            marginBottom: BASE_DIMENSION
        },
        rightValue: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
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
