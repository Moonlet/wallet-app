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
            height: BASE_DIMENSION * 5,
            marginTop: BASE_DIMENSION * 3,
            borderRadius: BORDER_RADIUS,
            borderColor: 'gray',
            alignSelf: 'stretch',
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        input: {
            flex: 1,
            color: theme.colors.text
        }
    });
