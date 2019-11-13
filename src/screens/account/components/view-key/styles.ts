import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        contentContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            marginTop: BASE_DIMENSION * 5
        },
        rowContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION
        },
        keyWrapper: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: BASE_DIMENSION * 4,
            paddingHorizontal: BASE_DIMENSION * 5
        },
        keyText: {
            color: theme.colors.textSecondary, // TODO: fix
            fontSize: 16, // TODO: fix
            lineHeight: 24, // TODO: fix
            textAlign: 'center'
        },
        tipWrapper: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            backgroundColor: 'yellow', // TODO: fix
            padding: BASE_DIMENSION * 2,
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 3,
            borderRadius: BORDER_RADIUS
        },
        alertIcon: {
            marginRight: BASE_DIMENSION,
            color: theme.colors.primary
        },
        tipText: {
            color: theme.colors.primary, // TODO: fix
            fontSize: 12
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
