import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    normalize,
    BORDER_RADIUS
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION
        },
        imageContainer: {
            width: normalize(38),
            height: normalize(38),
            marginRight: BASE_DIMENSION,
            backgroundColor: theme.colors.black + '40', // 25% opacity
            borderRadius: BORDER_RADIUS,
            justifyContent: 'center',
            alignItems: 'center'
        },
        labelText: {
            fontWeight: '400',
            fontSize: normalizeFontAndLineHeight(23),
            lineHeight: normalizeFontAndLineHeight(34),
            color: theme.colors.white
        }
    });
