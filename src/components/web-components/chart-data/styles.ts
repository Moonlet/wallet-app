import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight } from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        chart: {
            height: BASE_DIMENSION * 10,
            width: BASE_DIMENSION * 10
        },
        colorSample: {
            width: BASE_DIMENSION * 0.5,
            height: BASE_DIMENSION * 0.5
        },
        text: {
            color: theme.colors.text,
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            paddingLeft: 5
        },
        row: {
            flexWrap: 'wrap',
            flexDirection: 'row',
            paddingRight: BASE_DIMENSION / 2,
            paddingVertical: BASE_DIMENSION / 2,
            maxWidth: BASE_DIMENSION * 10,
            justifyContent: 'center',
            alignItems: 'center'
        }
    });
