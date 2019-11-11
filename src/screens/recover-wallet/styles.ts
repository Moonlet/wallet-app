import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

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
            flexDirection: 'row',
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            marginBottom: 60,
            width: '80%'
        },

        mnemonicContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: 6,
            alignSelf: 'stretch',
            paddingVertical: 8,
            paddingHorizontal: 4,
            marginTop: 20
        },

        mnemonicLine: {
            flexDirection: 'row',
            paddingVertical: 8
        },

        inputContainer: {
            // borderWidth: 1, borderColor: 'green',
            flexBasis: 0,
            flex: 1,
            padding: 0,
            margin: 0,
            flexDirection: 'row'
        },

        input: {
            flex: 1,
            borderBottomWidth: 1,
            fontSize: 12,
            borderColor: 'gray',
            alignSelf: 'stretch',
            color: theme.colors.text,
            padding: 0,
            margin: 0,
            lineHeight: 16
        },

        inputLabel: {
            // borderWidth: 1, borderColor: 'red',
            flex: 0,
            textAlign: 'right',
            alignSelf: 'center',
            fontSize: 10,
            width: 18,
            paddingTop: 2
        },

        suggestionsContainer: {
            marginHorizontal: -BASE_DIMENSION * 2, // compensate for screen padding
            marginVertical: BASE_DIMENSION
        },

        suggestionButton: {
            paddingVertical: 6,
            marginHorizontal: 4
        },

        bottomButton: {
            flex: 1,
            flexBasis: 0,
            marginHorizontal: BASE_DIMENSION / 2
        }
    });
