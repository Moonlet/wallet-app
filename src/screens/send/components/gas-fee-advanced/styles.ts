import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {},
        inputBoxTop: {
            marginTop: 0
        },
        inputBox: {
            paddingVertical: BASE_DIMENSION,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        input: {
            flex: 1,
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.text
        },
        priceLabel: {
            fontSize: 13,
            lineHeight: 18,
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION
        },
        displayError: {
            fontSize: 15,
            lineHeight: 19,
            paddingLeft: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.error
        }
    });
