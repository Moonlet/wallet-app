import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        image: {
            height: normalize(60),
            width: '100%'
        }
    });
