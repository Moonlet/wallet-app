import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION / 2
        },
        exchangeCardContainer: {
            display: 'flex',
            flexDirection: 'row',
            marginHorizontal: -BASE_DIMENSION / 2,
            marginBottom: BASE_DIMENSION
        }
    });
