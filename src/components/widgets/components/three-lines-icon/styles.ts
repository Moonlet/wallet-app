import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
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
        imageBaseStyle: {
            position: 'absolute',
            right: BASE_DIMENSION,
            width: normalize(60),
            height: normalize(60)
        }
    });
