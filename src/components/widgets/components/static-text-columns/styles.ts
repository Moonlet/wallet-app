import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            paddingHorizontal: BASE_DIMENSION
        },
        itemContainer: {
            flex: 1,
            alignItems: 'flex-start'
        },
        headerValueText: {
            marginBottom: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        secondaryValueText: {
            marginBottom: BASE_DIMENSION / 2
        }
    });
