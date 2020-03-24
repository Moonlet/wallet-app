import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION, normalize } from '../../../../styles/dimensions';
import { pw, ph } from '../../../../styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1
        },
        contentContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            marginTop: BASE_DIMENSION * 5
        },
        emptyAddressContainer: {
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center'
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
            fontSize: normalize(22),
            lineHeight: normalize(28),
            textAlign: 'center',
            letterSpacing: 0.35,
            opacity: 0.4,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION
        },
        addAddressBookText: {
            fontSize: normalize(17),
            lineHeight: normalize(22),
            textAlign: 'center',
            opacity: 0.3,
            paddingHorizontal: BASE_DIMENSION * 2,
            color: theme.colors.text
        },
        rowContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: BASE_DIMENSION,
            paddingLeft: BASE_DIMENSION,
            backgroundColor: theme.colors.appBackground
        },
        address: {
            color: theme.colors.textSecondary
        },
        name: {
            color: theme.colors.text,
            fontSize: normalize(18),
            lineHeight: normalize(23)
        },
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: 'rgba(0,0,0,0.4)'
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.accent,
            padding: BASE_DIMENSION / 2
        },
        leftIcon: {
            paddingLeft: BASE_DIMENSION * 2,
            paddingRight: BASE_DIMENSION * 2
        },
        sectionTitle: {
            fontWeight: '600',
            fontSize: normalize(17),
            lineHeight: normalize(22),
            color: theme.colors.text,
            paddingTop: BASE_DIMENSION
        },
        selectedText: {
            color: theme.colors.accent
        },
        leftActionsContainer: {
            flexDirection: 'row'
        },
        action: {
            justifyContent: 'center',
            alignItems: 'center',
            width: normalize(72)
        },
        iconActionPositive: {
            height: normalize(40),
            color: theme.colors.accent
        },
        iconActionNegative: {
            height: normalize(40),
            color: theme.colors.error
        },
        textActionPositive: {
            fontSize: normalize(10),
            color: theme.colors.accent
        },
        textActionNegative: {
            fontSize: normalize(10),
            color: theme.colors.error
        }
    });
