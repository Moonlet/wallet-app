import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalize } from '../../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {},
        inputBoxTop: {
            marginTop: 0,
            marginBottom: BASE_DIMENSION
        },
        inputBox: {
            paddingVertical: BASE_DIMENSION,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        input: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.text
        },
        label: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION,
            marginTop: BASE_DIMENSION
        }
    });
