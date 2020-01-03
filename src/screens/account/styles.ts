import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingTop: BASE_DIMENSION * 5,
            paddingHorizontal: BASE_DIMENSION
        },
        balanceContainer: {
            marginTop: BASE_DIMENSION,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },
        buttonsContainer: {
            marginTop: BASE_DIMENSION * 8,
            marginHorizontal: BASE_DIMENSION,
            flexWrap: 'wrap',
            justifyContent: 'center',
            flexDirection: 'row'
        },
        button: {
            flex: 1,
            marginHorizontal: BASE_DIMENSION / 2
        }
    });
