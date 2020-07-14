import { StyleSheet } from 'react-native';
import { normalizeFontAndLineHeight } from '../../../styles/dimensions';
import { ITheme } from '../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        headerContainer: {
            flexDirection: 'row',
            height: 50
        },
        headerLeft: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: 20
        },
        headerCenter: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        headerRight: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 20
        },
        icon: {
            color: theme.colors.accent
        },
        socialIcon: {
            color: theme.colors.text,
            paddingHorizontal: 8
        },
        separator: {
            paddingLeft: 20
        },
        logoText: {
            color: theme.colors.accent
        },
        headerCenterText: {
            color: theme.colors.text,
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(41),
            letterSpacing: 0.4
        },
        socialContainer: {
            borderLeftColor: theme.colors.separator,
            borderLeftWidth: 2,
            display: 'flex',
            flexDirection: 'row',
            paddingTop: 12,
            height: '100%'
        }
    });
