import { StyleSheet, Platform } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../styles/dimensions';
import { pw, ph } from '../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            paddingBottom: BASE_DIMENSION * 2,
            paddingLeft: BASE_DIMENSION * 2,
            paddingRight: BASE_DIMENSION * 2,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            ...StyleSheet.absoluteFillObject
        },
        keyboardAvoidance: {
            flex: 1,
            justifyContent: Platform.OS === 'ios' ? 'space-between' : 'flex-start'
        },
        accountAddress: {
            paddingTop: 40
        },
        address: {
            fontSize: 30,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 40
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
            height: 44,
            borderRadius: BORDER_RADIUS,
            borderColor: 'gray',
            alignSelf: 'stretch',
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            borderColor: 'gray',
            alignSelf: 'stretch',
            backgroundColor: theme.colors.inputBackground,
            paddingHorizontal: 12,
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
            color: theme.colors.accent,
            marginHorizontal: 0
        },
        rightAddressButton: {
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
        },
        emptyAddressContainer: {
            flex: 1,
            justifyContent: 'center',
            marginTop: BASE_DIMENSION * 6
        },
        logoImage: {
            height: ph(20),
            width: pw(40),
            alignSelf: 'center',
            resizeMode: 'contain',
            marginBottom: BASE_DIMENSION * 3
        },
        emptyAddressText: {
            fontWeight: 'bold',
            fontSize: 22,
            lineHeight: 28,
            textAlign: 'center',
            letterSpacing: 0.35,
            opacity: 0.37,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION
        },
        addAddressBookText: {
            fontSize: 17,
            lineHeight: 22,
            textAlign: 'center',
            opacity: 0.37,
            paddingHorizontal: BASE_DIMENSION * 2,
            color: '#E6E4EA' // theme.colors.primary
        }
    });
