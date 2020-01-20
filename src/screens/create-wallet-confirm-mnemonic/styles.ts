import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 16,
            paddingTop: 30,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.appBackground,
            height: '100%'
        },

        topContainer: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
            alignSelf: 'stretch',
            paddingTop: 40,
            paddingBottom: 60
        },

        bottomContainer: {
            flex: 0,
            justifyContent: 'center',
            alignSelf: 'stretch',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION * 6
        },

        inputContainer: {
            alignSelf: 'stretch',
            flex: 1,
            justifyContent: 'center'
        },

        input: {
            height: 40,
            borderRadius: 6,
            borderColor: 'gray',
            alignSelf: 'stretch',
            color: theme.colors.text,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: 12,
            marginBottom: 20
        },

        bottomButton: {
            width: '80%'
        }
    });
