import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { ICON_CONTAINER_SIZE, BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        icon: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            alignSelf: 'center'
        },
        marginHorizontal: {
            marginHorizontal: BASE_DIMENSION
        }
    });
