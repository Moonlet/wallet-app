import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingTop: BASE_DIMENSION * 10,
            paddingBottom: BASE_DIMENSION * 5,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground
        },
        inputContainer: {
            flex: 1,
            flexDirection: 'column'
        },
        inputBox: {
            height: BASE_DIMENSION * 5 + BASE_DIMENSION / 2,
            marginBottom: BASE_DIMENSION * 6,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        contractAddressContainer: {
            marginBottom: BASE_DIMENSION * 3
        },
        contractAddressBox: {
            height: BASE_DIMENSION * 5 + BASE_DIMENSION / 2,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2,
            marginBottom: BASE_DIMENSION / 2
        },
        input: {
            flex: 1,
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.text
        },
        saveButton: {
            width: '80%',
            alignSelf: 'center'
        },
        addressErrors: {
            flexDirection: 'column',
            marginBottom: BASE_DIMENSION * 3
        },
        displayError: {
            paddingLeft: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.error,
            fontSize: 15,
            lineHeight: 20
        },
        receipientWarning: {
            paddingLeft: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.warning,
            fontSize: 15,
            lineHeight: 20
        }
    });
