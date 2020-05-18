import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    ICON_CONTAINER_SIZE,
    normalizeFontAndLineHeight
} from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingVertical: BASE_DIMENSION * 5,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground
        },
        inputContainer: {
            flex: 1,
            flexDirection: 'column'
        },
        inputBox: {
            height: BASE_DIMENSION * 5,
            borderRadius: BORDER_RADIUS,
            alignSelf: 'stretch',
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: BASE_DIMENSION,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION * 2
        },
        input: {
            flex: 1,
            fontSize: normalizeFontAndLineHeight(15),
            color: theme.colors.text
        },
        bottomButtonContainer: {
            marginHorizontal: BASE_DIMENSION * 2
        },
        searchIcon: {
            alignSelf: 'center',
            color: theme.colors.textTertiary,
            marginRight: BASE_DIMENSION
        },
        closeIconContainer: {
            paddingLeft: BASE_DIMENSION,
            justifyContent: 'center'
        },
        closeIcon: {
            alignSelf: 'center',
            color: theme.colors.accent
        },
        tokenCardContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderWidth: 2,
            borderColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingHorizontal: BASE_DIMENSION,
            paddingVertical: BASE_DIMENSION * 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION,
            flexDirection: 'row'
        },
        tokenSelectedContainer: {
            borderColor: theme.colors.accentSecondary
        },
        accountInfoContainer: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            marginHorizontal: BASE_DIMENSION
        },
        iconContainer: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            justifyContent: 'center',
            alignItems: 'center'
        },
        icon: {
            color: theme.colors.accent
        },
        address: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary
        },
        tokenNameText: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            letterSpacing: 0.38,
            color: theme.colors.text,
            fontWeight: '500'
        },
        tokenAddressText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            letterSpacing: 0.38,
            color: theme.colors.textTertiary
        },
        errorWrapper: {
            flexDirection: 'column',
            marginTop: BASE_DIMENSION * 10
        },
        noMatchText: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.textTertiary,
            letterSpacing: 0.35,
            fontWeight: 'bold',
            marginBottom: BASE_DIMENSION,
            textAlign: 'center'
        },
        noGiveUpText: {
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textTertiary,
            textAlign: 'center'
        }
    });
