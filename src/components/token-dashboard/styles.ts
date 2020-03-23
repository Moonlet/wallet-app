import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';
import { normalize } from '../../library';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        exchangeCardContainer: {
            display: 'flex',
            flexDirection: 'row',
            marginHorizontal: -normalize(BASE_DIMENSION / 2),
            marginBottom: normalize(BASE_DIMENSION)
        },
        scrollContainer: {
            flexGrow: 1
        }
    });
