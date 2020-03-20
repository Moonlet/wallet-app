import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../../../styles/dimensions';

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
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.text
        },
        label: {
            fontSize: 13,
            lineHeight: 18,
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION,
            marginTop: BASE_DIMENSION
        }
    });
