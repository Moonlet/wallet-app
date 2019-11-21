import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION } from '../../styles/dimensions';

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
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingTop: BASE_DIMENSION,
            paddingBottom: BASE_DIMENSION * 2
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
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: 6
        },
        keyContainer: {
            flex: 1,
            paddingVertical: BASE_DIMENSION,
            paddingHorizontal: BASE_DIMENSION,
            minWidth: 30,
            maxWidth: 35,
            marginHorizontal: 3,
            justifyContent: 'center',
            alignContent: 'center'
        },
        keyText: {
            fontSize: 22,
            lineHeight: 26,
            textAlign: 'center'
        },
        upperIcon: {
            justifyContent: 'center',
            marginRight: BASE_DIMENSION * 2
        },
        deleteIcon: {
            justifyContent: 'center',
            marginLeft: BASE_DIMENSION * 2
        },
        icon: {
            color: theme.colors.accent
        }
    });
