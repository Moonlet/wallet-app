import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        },
        textInputArea: {
            flexDirection: 'row',
            marginHorizontal: BASE_DIMENSION * 2,
            padding: BASE_DIMENSION,
            borderColor: theme.colors.accent,
            borderWidth: 1,
            marginTop: 40,
            minHeight: 40
        },
        text: {
            fontSize: 16,
            lineHeight: 21,
            textAlign: 'center'
        }
    });
