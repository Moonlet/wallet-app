import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        circle: {
            overflow: 'hidden',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center'
        },
        leftWrap: {
            overflow: 'hidden',
            position: 'absolute',
            top: 0
        },
        rightWrap: {
            position: 'absolute'
        },
        loader: {
            position: 'absolute',
            left: 0,
            top: 0,
            borderRadius: 1000
        },
        innerCircle: {
            overflow: 'hidden',
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center'
        }
    });
