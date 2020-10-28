import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingHorizontal: BASE_DIMENSION,
            marginVertical: BASE_DIMENSION
        },
        headerValueText: {
            marginBottom: BASE_DIMENSION / 2,
            textAlign: 'center',
            fontSize: normalizeFontAndLineHeight(13)
        },
        secondaryValueText: {
            textAlign: 'center',
            fontWeight: '500'
        }
    });
