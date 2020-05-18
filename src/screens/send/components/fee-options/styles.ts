import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../../../styles/dimensions';

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
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.accent
        },
        list: {
            flexGrow: 1,
            justifyContent: 'flex-start'
        },
        displayErrorFees: {
            flex: 1,
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(19),
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.error
        }
    });
