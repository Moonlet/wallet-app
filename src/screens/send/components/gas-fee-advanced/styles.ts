import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 0
        },
        input: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION * 2
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row'
        },
        priceLabel: {
            fontSize: 13,
            lineHeight: 18,
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION
        },
        gasPriceUnit: {
            fontSize: 13,
            lineHeight: 18,
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION / 2,
            marginTop: BASE_DIMENSION
        },
        displayError: {
            fontSize: 15,
            lineHeight: 19,
            paddingLeft: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.error
        },
        displayErrorFees: {
            fontSize: 15,
            lineHeight: 19,
            paddingLeft: BASE_DIMENSION,
            marginTop: BASE_DIMENSION,
            color: theme.colors.error
        }
    });
