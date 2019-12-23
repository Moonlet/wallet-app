import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#2c2c2fAA'
        },
        header: {
            flex: 1,
            backgroundColor: theme.colors.cardBackgroundSecondary,
            paddingTop: BASE_DIMENSION * 2
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        }
    });
