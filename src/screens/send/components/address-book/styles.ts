import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import { BASE_DIMENSION } from '../../../../styles/dimensions';
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
            fontSize: 22,
            lineHeight: 28,
            textAlign: 'center',
            letterSpacing: 0.35,
            opacity: 0.4,
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION
        },
        addAddressBookText: {
            fontSize: 17,
            lineHeight: 22,
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
            fontSize: theme.fontSize.regular,
            color: theme.colors.textSecondary
        },
        name: {
            color: theme.colors.text,
            lineHeight: BASE_DIMENSION * 3,
            fontSize: theme.fontSize.regular + 1
        },
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: 'rgba(0,0,0,0.4)'
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.accent,
            padding: 4
        },
        textRow: {
            fontSize: theme.fontSize.regular,
            lineHeight: 30
        },
        leftIcon: {
            paddingLeft: BASE_DIMENSION * 2,
            paddingRight: BASE_DIMENSION * 2
        },
        sectionTitle: {
            fontWeight: '600',
            fontSize: 17,
            lineHeight: 22,
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
            width: 72
        },

        iconActionPositive: {
            height: 40,
            color: theme.colors.accent
        },

        iconActionNegative: {
            height: 40,
            color: theme.colors.error
        },

        textActionPositive: {
            fontSize: 10,
            color: theme.colors.accent
        },

        textActionNegative: {
            fontSize: 10,
            color: theme.colors.error
        }
    });
