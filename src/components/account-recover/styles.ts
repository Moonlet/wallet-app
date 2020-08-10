import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, ICON_CONTAINER_SIZE } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            paddingHorizontal: BASE_DIMENSION * 2
        },
        createText: {
            fontSize: 22,
            lineHeight: 28,
            fontWeight: 'bold',
            letterSpacing: 0.35,
            color: theme.colors.text,
            textAlign: 'center',
            marginBottom: BASE_DIMENSION
        },
        chooseUsernameText: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: BASE_DIMENSION * 4
        },
        congratsText: {
            fontSize: 15,
            lineHeight: 20,
            color: theme.colors.accent
        },
        invalidText: {
            fontSize: 15,
            lineHeight: 20,
            color: theme.colors.error
        },
        createButton: {
            width: '80%',
            alignSelf: 'center',
            marginBottom: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        inputContainer: {
            marginBottom: BASE_DIMENSION * 4
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            borderColor: 'gray',
            alignSelf: 'stretch',
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        input: {
            flex: 1,
            color: theme.colors.text
        },
        icon: {
            color: theme.colors.accent
        },
        rightAddressButton: {
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row'
        },
        recoverAccount: {
            fontSize: 15,
            lineHeight: 20,
            textAlign: 'center',
            color: theme.colors.accent
        },
        inputWrapper: {
            marginVertical: BASE_DIMENSION * 4
        },
        buttonsContainer: {
            flexDirection: 'row'
        },
        bottomButton: {
            flex: 1,
            marginHorizontal: BASE_DIMENSION / 2
        },
        circle: {
            height: 50,
            width: 50,
            borderRadius: 25,
            padding: BASE_DIMENSION,
            backgroundColor: theme.colors.accentSecondary,
            marginRight: BASE_DIMENSION * 2
        },
        number: {
            fontSize: 28,
            lineHeight: 34,
            textAlign: 'center',
            color: theme.colors.accent
        },
        infoRow: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        infoText: {
            fontSize: 17,
            lineHeight: 22,
            color: theme.colors.text,
            alignSelf: 'center'
        },
        rowCardContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingHorizontal: BASE_DIMENSION,
            paddingVertical: BASE_DIMENSION * 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION,
            flexDirection: 'row'
        },
        cardInfoContainer: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            marginLeft: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        firstTCardText: {
            fontSize: 18,
            lineHeight: 25,
            letterSpacing: 0.38,
            color: theme.colors.text,
            fontWeight: '500'
        },
        secondCardText: {
            fontSize: 16,
            lineHeight: 20,
            color: theme.colors.textSecondary
        },
        title: {
            fontSize: 22,
            lineHeight: 28,
            color: theme.colors.text,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: BASE_DIMENSION * 10
        }
    });
