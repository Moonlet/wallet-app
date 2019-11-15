import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        contentContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            marginTop: BASE_DIMENSION * 5
        },
        rowContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: BASE_DIMENSION
        },
        leftColumn: {},
        address: {
            fontSize: theme.fontSize.regular,
            color: theme.colors.textSecondary
        },
        name: {
            color: theme.colors.text,
            lineHeight: BASE_DIMENSION * 3,
            fontSize: theme.fontSize.regular + 1
        },
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: 'rgba(0,0,0,0.4)'
        },
        icon: {
            color: theme.colors.accent,
            padding: 4
        },
        textRow: {
            fontSize: theme.fontSize.regular,
            lineHeight: 30
        },
        leftIcon: {
            paddingLeft: BASE_DIMENSION * 2,
            paddingRight: BASE_DIMENSION * 2
        }
    });
