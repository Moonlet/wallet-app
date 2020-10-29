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
        row: {
            flexDirection: 'row'
        },
        headerText: {
            fontSize: normalizeFontAndLineHeight(15)
        },
        bodyText: {
            fontWeight: '500',
            fontSize: normalizeFontAndLineHeight(16),
            marginBottom: BASE_DIMENSION / 2
        }
    });
