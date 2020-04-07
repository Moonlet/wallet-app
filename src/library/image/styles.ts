import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { ICON_SIZE } from '../../styles/dimensions';

const iconSmallSize = ICON_SIZE;
const iconLargeSize = ICON_SIZE + ICON_SIZE / 2;

export default (theme: ITheme) =>
    StyleSheet.create({
        icon: {
            alignSelf: 'center'
        },
        small: {
            width: iconSmallSize,
            height: iconSmallSize
        },
        large: {
            width: iconLargeSize,
            height: iconLargeSize
        }
    });
