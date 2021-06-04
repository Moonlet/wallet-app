import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        inputBox: {
            flex: 1,
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row'
        },
        row: {
            flex: 1,
            flexDirection: 'row'
        },
        inputText: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION * 2,
            fontSize: normalizeFontAndLineHeight(15)
        },
        searchIcon: {
            color: theme.colors.text,
            alignSelf: 'center',
            paddingRight: BASE_DIMENSION * 2
        },
        cancelContainer: {
            marginLeft: BASE_DIMENSION * 2,
            justifyContent: 'center'
        },
        cancel: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.accent
        }
    });
