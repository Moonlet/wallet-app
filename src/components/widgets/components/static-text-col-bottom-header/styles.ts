import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            paddingHorizontal: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION * 2
        },
        itemContainer: {
            flex: 1
        },
        headerValueText: {
            fontSize: normalizeFontAndLineHeight(15)
        },
        secondaryValueText: {
            fontWeight: '500',
            fontSize: normalizeFontAndLineHeight(16),
            marginBottom: BASE_DIMENSION / 2
        }
    });
