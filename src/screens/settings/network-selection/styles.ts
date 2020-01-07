import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingVertical: BASE_DIMENSION * 3,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION * 2,
            alignItems: 'center'
        },
        textRow: {
            flex: 1,
            fontSize: 20,
            lineHeight: 25,
            letterSpacing: 0.38,
            color: theme.colors.text
        },
        textRowValue: {
            fontSize: 15,
            color: theme.colors.textSecondary,
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
            alignItems: 'center'
        },
        rightText: {
            flex: 1,
            fontSize: 12,
            lineHeight: 16,
            color: theme.colors.textSecondary,
            marginRight: BASE_DIMENSION * 2
        },
        icon: {
            color: theme.colors.accent
        }
    });
