import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, ICON_CONTAINER_SIZE } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingBottom: BASE_DIMENSION * 2,
            paddingLeft: BASE_DIMENSION * 2,
            paddingRight: BASE_DIMENSION * 2,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground
        },
        keyboardAvoidance: {
            flex: 1,
            justifyContent: Platform.OS === 'ios' ? 'space-between' : 'flex-start'
        },
        accountAddress: {
            paddingTop: BASE_DIMENSION * 5
        },
        address: {
            fontSize: 30,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: BASE_DIMENSION * 5
        },
        input: {
            flex: 1,
            color: theme.colors.text
        },
        inputAddress: {
            flex: 1,
            color: theme.colors.text,
            paddingRight: BASE_DIMENSION * 2
        },
        receipientLabel: {
            paddingLeft: BASE_DIMENSION,
            marginTop: BASE_DIMENSION * 3,
            color: theme.colors.textSecondary
        },
        displayError: {
            paddingLeft: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.error
        },
        receipientWarning: {
            paddingLeft: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            color: theme.colors.warning
        },
        inputBoxAddress: {
            borderRadius: BORDER_RADIUS,
            borderColor: 'gray',
            alignSelf: 'stretch',
            backgroundColor: theme.colors.textTertiary,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            borderColor: 'gray',
            alignSelf: 'stretch',
            backgroundColor: theme.colors.textTertiary,
            paddingHorizontal: BASE_DIMENSION,
            marginTop: BASE_DIMENSION,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        bottom: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION * 2
        },
        bottomButton: {
            width: '90%'
        },
        basicFields: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 5,
            backgroundColor: theme.colors.appBackground
        },
        icon: {
            color: theme.colors.accent
        },
        rightAddressButton: {
            height: ICON_CONTAINER_SIZE,
            width: ICON_CONTAINER_SIZE,
            justifyContent: 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            marginRight: BASE_DIMENSION / 2
        },
        buttonRightOptions: {
            marginTop: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION,
            alignItems: 'flex-end'
        },
        textTranferButton: {
            color: theme.colors.accent,
            lineHeight: 21,
            fontSize: theme.fontSize.small
        },
        addressNotInBookText: {
            fontSize: theme.fontSize.regular,
            lineHeight: 20,
            color: theme.colors.accent
        }
    });
