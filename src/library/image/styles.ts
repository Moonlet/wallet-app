import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { ICON_CONTAINER_SIZE } from '../../styles/dimensions';
import { normalize } from '..';

export default (theme: ITheme) =>
    StyleSheet.create({
        icon: {
            width: normalize(ICON_CONTAINER_SIZE),
            height: normalize(ICON_CONTAINER_SIZE),
            alignSelf: 'center'
        }
    });
