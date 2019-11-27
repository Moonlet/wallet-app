import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';

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
            justifyContent: 'center',
            width: '100%'
        },

        input: {
            flex: 1,
            color: theme.colors.text
        },

        inputBox: {
            height: 40,
            borderRadius: 6,
            borderColor: 'gray',
            alignSelf: 'stretch',
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: 12,
            marginTop: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },

        icon: {
            color: theme.colors.accent,
            padding: 4
        },

        bottomContainer: {
            marginTop: 10,
            flex: 1,
            width: '80%'
        },

        bottomButton: {
            width: '100%'
        },

        errorMessage: {
            textAlign: 'center',
            width: '100%'
        }
    });
