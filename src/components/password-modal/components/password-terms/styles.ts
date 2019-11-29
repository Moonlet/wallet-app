import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingHorizontal: 16,
            paddingTop: 40,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.appBackground
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

        confirmTextContainer: {
            flexDirection: 'row'
        },
        textStyle: {
            textAlign: 'center',
            marginTop: 60
        },
        imageStyle: {
            alignItems: 'center',
            alignSelf: 'stretch',
            marginTop: 40
        },
        icon: {
            color: theme.colors.accent,
            paddingRight: 8
        }
    });
