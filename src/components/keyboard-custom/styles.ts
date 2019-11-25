import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.colors.appBackground,
            padding: BASE_DIMENSION / 2
        },
        headerButtonContainer: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION / 2
        },
        headerButton: {
            flex: 1,
            paddingVertical: BASE_DIMENSION,
            backgroundColor: theme.colors.cardBackground
        },
        keyboardLayout: {
            flex: 1,
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: BASE_DIMENSION / 2,
            paddingBottom: BASE_DIMENSION
        },
        nextWordContainer: {
            backgroundColor: theme.colors.primary,
            paddingVertical: BASE_DIMENSION,
            marginTop: BASE_DIMENSION,
            marginHorizontal: BASE_DIMENSION * 3
        },
        nextWordText: {
            textAlign: 'center',
            fontSize: 14
        },
        pasteWordText: {
            fontSize: 14,
            textAlign: 'center'
        },
        confirmWordText: {
            textAlign: 'center',
            color: theme.colors.accent,
            fontSize: 14
        },
        rowContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: 6
        },
        keyContainer: {
            flex: 1,
            backgroundColor: theme.colors.primary,
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION,
            maxWidth: 35,
            marginHorizontal: 3,
            justifyContent: 'center',
            alignContent: 'center'
        },
        keyText: {
            flex: 1,
            fontSize: 22,
            lineHeight: 26,
            textAlign: 'center'
        },
        upperIcon: {
            justifyContent: 'center',
            paddingHorizontal: BASE_DIMENSION
        },
        deleteIcon: {
            justifyContent: 'center',
            paddingHorizontal: BASE_DIMENSION
        },
        icon: {
            color: theme.colors.accent
        }
    });
