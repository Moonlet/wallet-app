import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'column'
        },
        topContainer: {
            width: '100%',
            justifyContent: 'space-around',
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2
        }
    });
