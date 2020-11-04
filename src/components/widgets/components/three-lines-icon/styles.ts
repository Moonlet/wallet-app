import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { normalize } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between'
            // marginBottom: BASE_DIMENSION + BASE_DIMENSION / 2,
            // paddingHorizontal: BASE_DIMENSION
        },
        row: {
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        lineText: {
            color: theme.colors.text
        },
        imageBaseStyle: {
            width: normalize(60),
            height: normalize(60),
            alignSelf: 'center'
        }
    });
