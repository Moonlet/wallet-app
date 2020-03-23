import { StyleSheet, Dimensions } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingTop: BASE_DIMENSION * 4,
            paddingBottom: BASE_DIMENSION * 7,
            alignItems: 'center',
            backgroundColor: theme.colors.appBackground
        },
        inputContainer: {
            height: Dimensions.get('window').height / 2,
            width: '100%',
            justifyContent: 'center'
        },
        inputWrapper: {
            height: BASE_DIMENSION * 5,
            paddingVertical: BASE_DIMENSION,
            borderRadius: BORDER_RADIUS,
            color: theme.colors.text,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2,
            marginBottom: BASE_DIMENSION * 2
        },
        inputText: {
            fontSize: normalize(14),
            lineHeight: normalize(21)
        },
        errorMessage: {
            fontSize: normalize(15),
            lineHeight: normalize(19),
            color: theme.colors.error,
            textAlign: 'center',
            marginVertical: BASE_DIMENSION * 2
        },
        testWords: {
            textAlign: 'center'
        },
        label: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            paddingLeft: BASE_DIMENSION * 2,
            color: theme.colors.textSecondary
        }
    });
