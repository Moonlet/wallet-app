import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#2c2c2fAA'
        }
    });
