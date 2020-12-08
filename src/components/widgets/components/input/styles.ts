import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            //
        },
        inputBox: {
            minHeight: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: BASE_DIMENSION,
            paddingVertical: BASE_DIMENSION / 2,
            flexDirection: 'row'
        },
        inputText: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION * 2,
            fontSize: normalizeFontAndLineHeight(15)
        }
    });
