import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BORDER_RADIUS, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        image: {
            height: normalize(60),
            width: '100%',
            borderRadius: BORDER_RADIUS
        }
    });
