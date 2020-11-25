import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground
        },
        scrollContainer: {
            flexGrow: 1,
            marginHorizontal: BASE_DIMENSION * 2,
            paddingVertical: BASE_DIMENSION * 2
        }
    });
