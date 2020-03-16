import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            padding: BASE_DIMENSION * 2
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
            height: 30
        },
        inputLabel: {
            textAlign: 'right',
            alignSelf: 'center',
            fontSize: 10,
            width: 18,
            lineHeight: 30,
            color: theme.colors.text,
            paddingTop: BASE_DIMENSION / 4
        },
        suggestionButton: {
            paddingVertical: 6,
            marginHorizontal: BASE_DIMENSION / 2
        },
        bottomButton: {
            flex: 1,
            flexBasis: 0,
            marginHorizontal: BASE_DIMENSION / 2
        }
    });
