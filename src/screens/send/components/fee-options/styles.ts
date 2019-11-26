import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            marginTop: BASE_DIMENSION * 4,
            marginBottom: BASE_DIMENSION
        },
        containerPresets: {
            flex: 1
        },
        buttonRightOptions: {
            marginTop: BASE_DIMENSION,
            alignItems: 'flex-end'
        },
        textTranferButton: {
            color: theme.colors.accent,
            lineHeight: BASE_DIMENSION * 3,
            fontSize: theme.fontSize.small
        },
        feeTitle: {
            paddingLeft: BASE_DIMENSION,
            color: theme.colors.textSecondary
        },
        list: {
            flexGrow: 1,
            justifyContent: 'flex-start'
        }
    });
