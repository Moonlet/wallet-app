import { StyleSheet } from 'react-native';
import { normalizeFontAndLineHeight, BASE_DIMENSION } from '../../../styles/dimensions';
import { ITheme } from '../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        headerContainer: {
            flexDirection: 'row',
            height: BASE_DIMENSION * 2
        },
        headerLeft: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: BASE_DIMENSION
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
            paddingRight: BASE_DIMENSION
        },
        icon: {
            color: theme.colors.accent
        },
        socialIcon: {
            color: theme.colors.text,
            paddingHorizontal: BASE_DIMENSION * 0.4
        },
        separator: {
            paddingLeft: BASE_DIMENSION
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
            borderLeftWidth: BASE_DIMENSION * 0.1,
            height: '100%',
            flexDirection: 'row',
            paddingTop: BASE_DIMENSION * 0.5
        },
        validatorIcon: {
            width: BASE_DIMENSION * 0.5,
            height: BASE_DIMENSION * 0.5,
            borderRadius: BASE_DIMENSION * 0.5
        }
    });
