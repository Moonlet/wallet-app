import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { pw } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            padding: 0,
            paddingTop: 40,
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: theme.colors.appBackground,
            height: '100%'
        },

        buttonsContainer: {
            margin: 26,
            alignSelf: 'stretch',
            height: '30%'
        },

        button: {
            flex: 1,
            flexBasis: 0,
            marginHorizontal: 6
        },

        bottomButton: {
            flex: 1,
            flexBasis: 0,
            marginHorizontal: 6,
            marginTop: 20
        },
        logoImage: {
            width: pw(60),
            resizeMode: 'center'
        },
        textContainer: {
            alignItems: 'center',
            alignSelf: 'stretch',
            margin: 26
        }
    });
