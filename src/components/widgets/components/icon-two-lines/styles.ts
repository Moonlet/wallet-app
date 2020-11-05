import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        row: {
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        lineText: {
            color: theme.colors.text
        },
        marginBottom: {
            marginBottom: BASE_DIMENSION / 2
        },
        imageBaseStyle: {
            right: BASE_DIMENSION,
            width: normalize(44),
            height: normalize(44),
            alignSelf: 'center',
            marginRight: BASE_DIMENSION
        }
    });
