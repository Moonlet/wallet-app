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
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        itemContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: BASE_DIMENSION,
            marginRight: BASE_DIMENSION
        },
        iconContainer: {
            width: normalize(36),
            height: normalize(36),
            backgroundColor: theme.colors.black + '40', // 25% opacity
            borderRadius: BORDER_RADIUS,
            justifyContent: 'center',
            marginRight: BASE_DIMENSION,
            alignSelf: 'center'
        },
        labelValuesContainer: {
            flex: 1
        },
        valueLabel: {
            fontWeight: '400',
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.text
        },
        labelText: {
            fontSize: normalizeFontAndLineHeight(15),
            fontWeight: '400',
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textTertiary
        }
    });
