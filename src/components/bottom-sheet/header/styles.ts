import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        header: {
            flex: 1,
            backgroundColor: theme.colors.cardBackground,
            paddingTop: BASE_DIMENSION * 2,
            paddingBottom: BASE_DIMENSION
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.accent
        }
    });
