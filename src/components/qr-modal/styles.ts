import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingTop: 0,
            paddingBottom: 18,
            paddingLeft: 0,
            paddingRight: 0,
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        }
    });
