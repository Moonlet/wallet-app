import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            marginBottom: BASE_DIMENSION
        },
        buttonRightOptions: {
            alignItems: 'flex-end'
        },
        textTranferButton: {
            fontSize: 13,
            lineHeight: 18,
            color: theme.colors.accent
        },
        list: {
            flexGrow: 1,
            justifyContent: 'flex-start'
        }
    });
