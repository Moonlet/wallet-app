import { StyleSheet } from 'react-native';
import { BASE_DIMENSION } from '../../../../../../../styles/dimensions';
import { ITheme } from '../../../../../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            marginTop: BASE_DIMENSION,
            marginHorizontal: -BASE_DIMENSION - BASE_DIMENSION / 2 // TODO: fix this later on
        }
    });
