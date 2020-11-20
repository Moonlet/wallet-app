import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground
        },
        scrollView: {
            flexGrow: 1
        },
        fixedBottomArea: {
            // position: 'absolute',
            // bottom: 0,
            // left: 0,
            // right: 0
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
        }
    });
