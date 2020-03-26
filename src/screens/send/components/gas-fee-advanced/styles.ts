import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 0
        },
        input: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION * 2,
            fontSize: normalize(15),
            lineHeight: normalize(20)
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row'
        },
        priceLabel: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION
        },
        gasPriceUnit: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION / 2,
            marginTop: BASE_DIMENSION
        },
        displayError: {
            fontSize: normalize(15),
            lineHeight: normalize(19),
            paddingLeft: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.error
        }
    });
