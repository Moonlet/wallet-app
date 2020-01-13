import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, ICON_CONTAINER_SIZE } from '../../styles/dimensions';

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
            flexDirection: 'row',
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 2,
            borderRadius: 10,
            backgroundColor: theme.colors.cardBackground,
            paddingHorizontal: BASE_DIMENSION,
            paddingVertical: BASE_DIMENSION
        },
        input: {
            flex: 1,
            fontSize: 17,
            lineHeight: 22,
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
        closeIcon: {
            alignSelf: 'center',
            color: theme.colors.accent
        },

        ///
        tokenCardContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingHorizontal: BASE_DIMENSION / 2,
            paddingVertical: BASE_DIMENSION * 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: BASE_DIMENSION,
            flexDirection: 'row'
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
            fontSize: 16,
            lineHeight: 20,
            color: theme.colors.textSecondary
        },
        firstAmount: {
            fontSize: 18,
            lineHeight: 25,
            letterSpacing: 0.38,
            color: theme.colors.text,
            fontWeight: '500'
        },
        secondAmount: {
            fontSize: 16,
            lineHeight: 20,
            letterSpacing: 0.38,
            color: theme.colors.text,
            fontWeight: '500'
        }
    });
