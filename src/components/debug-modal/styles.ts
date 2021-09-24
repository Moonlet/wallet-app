import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            padding: BASE_DIMENSION * 3
        },
        row: {
            flexDirection: 'column',
            marginBottom: BASE_DIMENSION * 2
        },
        button: {
            marginVertical: BASE_DIMENSION * 2
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            alignSelf: 'stretch',
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION * 2
        },
        input: {
            flex: 1,
            fontSize: normalizeFontAndLineHeight(15),
            color: theme.colors.text,
            padding: 0
        },
        epochContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: BASE_DIMENSION * 2
        }
    });
