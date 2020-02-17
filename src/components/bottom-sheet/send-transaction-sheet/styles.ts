import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        content: {
            backgroundColor: theme.colors.bottomSheetBackground,
            paddingHorizontal: BASE_DIMENSION * 3,
            paddingVertical: BASE_DIMENSION * 2
        },
        message: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.textSecondary,
            marginTop: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 5,
            textAlign: 'center'
        },
        messageError: {
            color: theme.colors.error
        },
        messageWarning: {
            color: theme.colors.warning
        }
    });
