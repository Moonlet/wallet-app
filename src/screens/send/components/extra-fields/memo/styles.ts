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
        inputText: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION * 2,
            fontSize: normalize(15)
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row'
        },
        label: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            color: theme.colors.textSecondary,
            paddingLeft: BASE_DIMENSION,
            marginTop: BASE_DIMENSION
        }
    });
