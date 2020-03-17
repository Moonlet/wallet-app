import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            display: 'flex',
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: theme.colors.gradientDark,
            opacity: 0.75,
            justifyContent: 'center'
        },
        message: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginTop: BASE_DIMENSION
        }
    });
