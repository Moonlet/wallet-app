import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginBottom: BASE_DIMENSION
        },
        buttonRightOptions: {
            alignItems: 'flex-end',
            alignSelf: 'center'
        },
        textTranferButton: {
            fontSize: normalize(13),
            lineHeight: normalize(18),
            color: theme.colors.accent
        },
        list: {
            flexGrow: 1,
            justifyContent: 'flex-start'
        },
        displayErrorFees: {
            flex: 1,
            fontSize: normalize(15),
            lineHeight: normalize(19),
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.error
        }
    });
