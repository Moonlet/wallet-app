import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        },

        topContainer: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignSelf: 'stretch'
        },

        bottomContainer: {
            flex: 0,
            justifyContent: 'center',
            alignSelf: 'stretch',
            alignItems: 'center',
            marginBottom: 60
        },

        bottomButton: {
            width: '80%',
            marginTop: 40
        },

        rowContainer: {
            flexDirection: 'row',
            paddingVertical: 12,
            justifyContent: 'space-between',
            alignSelf: 'stretch'
        },

        rightContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            flex: 0,
            paddingRight: 8
        },

        divider: {
            width: '100%',
            height: 1,
            backgroundColor: theme.colors.settingsDivider
        },

        icon: {
            color: theme.colors.accent,
            fontWeight: 'bold'
        }
    });
