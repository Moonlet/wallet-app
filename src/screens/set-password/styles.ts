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

        icon: {
            color: theme.colors.accent,
            padding: 4
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
        }
    });
