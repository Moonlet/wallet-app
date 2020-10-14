import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, SCREEN_HEIGHT } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web,
        },
        content: {
            flex: 1
        },
        listContainer: {
            flex: 1,
            marginHorizontal: BASE_DIMENSION * 2
        },
        validatorsList: {
            paddingTop: BASE_DIMENSION * 2,
            paddingBottom: BASE_DIMENSION * 11
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center'
        }
    });
