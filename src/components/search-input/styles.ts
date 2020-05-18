import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        inputContainer: {
            flex: 1,
            flexDirection: 'column'
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
            color: theme.colors.text
        },
        closeIconContainer: {
            paddingLeft: BASE_DIMENSION,
            justifyContent: 'center'
        },
        closeIcon: {
            alignSelf: 'center',
            color: theme.colors.accent
        },
        searchIcon: {
            alignSelf: 'center',
            color: theme.colors.textTertiary,
            marginRight: BASE_DIMENSION
        }
    });
