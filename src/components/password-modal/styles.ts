import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../styles/dimensions';
import { normalize } from '../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: normalize(BASE_DIMENSION * 2),
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.appBackground
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
            height: normalize(BASE_DIMENSION * 5),
            borderRadius: BORDER_RADIUS,
            alignSelf: 'stretch',
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: normalize(BASE_DIMENSION + BASE_DIMENSION / 2),
            marginTop: normalize(BASE_DIMENSION * 5),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        icon: {
            color: theme.colors.accent,
            padding: normalize(BASE_DIMENSION / 2)
        },
        bottomContainer: {
            width: '80%',
            flex: 0,
            alignSelf: 'center',
            alignItems: 'center',
            marginBottom: normalize(BASE_DIMENSION * 7)
        },
        bottomButton: {
            width: '100%'
        },
        errorMessage: {
            textAlign: 'center',
            width: '100%'
        }
    });
