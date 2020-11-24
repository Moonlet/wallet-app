import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground
        },
        scrollView: {
            flexGrow: 1
        },
        errorContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        gradientBackground: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            flex: 1
        },
        skeletonContainer: {
            flex: 1,
            padding: BASE_DIMENSION * 2
        }
    });
