import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalize,
    SCREEN_HEIGHT,
    normalizeFontAndLineHeight
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            padding: BASE_DIMENSION * 2,
            height: SCREEN_HEIGHT // used for web
        },
        mnemonicContainer: {
            marginTop: BASE_DIMENSION * 3,
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            marginBottom: BASE_DIMENSION * 2,
            paddingTop: BASE_DIMENSION / 4,
            paddingBottom: BASE_DIMENSION * 2 - BASE_DIMENSION / 2,
            paddingLeft: BASE_DIMENSION / 4,
            paddingRight: BASE_DIMENSION
        },
        suggestionsContainer: {
            flexGrow: 1
        },
        mnemonicLine: {
            flexDirection: 'row',
            paddingVertical: Platform.OS === 'ios' ? BASE_DIMENSION / 2 : 0
        },
        inputContainer: {
            flex: 1,
            flexDirection: 'row',
            height: normalize(30)
        },
        inputLabel: {
            textAlign: 'right',
            alignSelf: 'center',
            fontSize: normalizeFontAndLineHeight(10),
            width: normalize(18),
            lineHeight: normalizeFontAndLineHeight(30),
            color: theme.colors.text,
            paddingTop: BASE_DIMENSION / 4
        },
        suggestionButton: {
            marginRight: BASE_DIMENSION
        },
        bottomButton: {
            flex: 1,
            flexBasis: 0,
            marginHorizontal: BASE_DIMENSION / 2
        },
        pasteButton: {
            marginTop: BASE_DIMENSION * 2
        }
    });
