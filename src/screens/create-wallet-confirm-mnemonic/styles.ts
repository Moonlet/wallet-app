import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../styles/dimensions';

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
            alignSelf: 'stretch',
            justifyContent: 'center',
            marginTop: BASE_DIMENSION * 20
        },
        inputWrapper: {
            // flexDirection: 'column',
            paddingVertical: BASE_DIMENSION,
            height: 40,
            borderRadius: BORDER_RADIUS,
            borderColor: theme.colors.inputBackground,
            // justifyContent: 'center',
            color: theme.colors.text,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2,
            marginBottom: BASE_DIMENSION * 3
        },
        inputText: {
            fontSize: 14,
            lineHeight: 21
        },
        errorMessage: {
            fontSize: 15,
            lineHeight: 19,
            color: theme.colors.error,
            textAlign: 'center',
            marginBottom: BASE_DIMENSION * 2
        }
    });
