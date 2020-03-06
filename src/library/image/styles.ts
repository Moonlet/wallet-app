import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { ICON_CONTAINER_SIZE } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        icon: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            alignSelf: 'center'
        }
    });
