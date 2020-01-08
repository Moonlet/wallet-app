import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            justifyContent: 'flex-start',
            flex: 1,
            backgroundColor: theme.colors.appBackground
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
            color: theme.colors.text
        },
        subTitle: {
            fontSize: 17,
            lineHeight: 22,
            textAlign: 'center',
            letterSpacing: 0.36,
            marginBottom: BASE_DIMENSION * 4,
            color: theme.colors.textSecondary
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
        touchIdIcon: {
            alignSelf: 'center',
            color: theme.colors.accent
        },
        deleteIcon: {
            alignSelf: 'center',
            color: theme.colors.textTertiary
        },
        inputRow: {
            justifyContent: 'center',
            flexDirection: 'row'
        },
        gradientContainer: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        selectorGradientContainer: {
            height: 1,
            width: '100%'
        },
        gradientRowContainer: {
            height: '100%',
            width: 1
        },
        pinInput: {
            width: 20,
            height: 20,
            borderRadius: 10,
            marginLeft: 10,
            marginRight: 10
        },
        unchecked: {
            borderColor: theme.colors.text,
            borderWidth: 1
        },
        checked: {
            backgroundColor: theme.colors.accent,
            borderRadius: 10
        }
    });
