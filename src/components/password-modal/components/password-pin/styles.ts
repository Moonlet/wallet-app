import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            justifyContent: 'flex-start',
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        },
        logoImage: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            alignSelf: 'center',
            resizeMode: 'cover',
            opacity: 0.1,
            height: '50%',
            width: '100%'
        },
        headerContainer: {
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'column',
            marginHorizontal: BASE_DIMENSION * 8
        },
        title: {
            fontSize: 28,
            lineHeight: 34,
            textAlign: 'center',
            letterSpacing: 0.36,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.text,
            opacity: 0.67
        },
        subTitle: {
            fontSize: 17,
            lineHeight: 22,
            textAlign: 'center',
            letterSpacing: 0.36,
            marginBottom: BASE_DIMENSION * 4,
            color: theme.colors.text,
            opacity: 0.67
        },
        errorMessage: {
            marginTop: BASE_DIMENSION * 2,
            fontSize: 16,
            lineHeight: 21,
            color: theme.colors.error,
            textAlign: 'center'
        },
        digitsLayout: {
            flex: 1,
            paddingBottom: BASE_DIMENSION * 2
        },
        keyRow: {
            flex: 1,
            flexDirection: 'row'
        },
        keyContainer: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme.colors.appBackground,
            margin: 2
        },
        keyText: {
            fontSize: 28,
            lineHeight: 34,
            color: theme.colors.text,
            textAlign: 'center'
        },
        resetKeyText: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.accent,
            textAlign: 'center'
        },
        checkedIcon: {
            alignSelf: 'center',
            color: theme.colors.accent,
            marginHorizontal: BASE_DIMENSION
        },
        deleteIcon: {
            alignSelf: 'center',
            color: theme.colors.accent
        },
        inputRow: {
            justifyContent: 'center',
            flexDirection: 'row'
        },
        selectorGradientContainer: {
            // position: 'absolute',
            // flex: 1,
            // left: 0,
            // right: 0,
            height: 1,
            // bottom: 0,
            // zIndex: 1,
            opacity: 0.87
            // justifyContent: 'flex-end'
        },
        unchecked: {
            width: 20,
            height: 20,
            borderRadius: 10,
            borderColor: 'white',
            borderWidth: 1,
            marginLeft: 10,
            marginRight: 10
        },
        checked: {
            width: 20,
            height: 20,
            backgroundColor: theme.colors.accent,
            borderRadius: 10,
            marginLeft: 10,
            marginRight: 10
        }
    });
