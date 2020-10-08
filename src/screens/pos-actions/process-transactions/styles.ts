import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    BORDER_RADIUS,
    LETTER_SPACING
} from '../../../styles/dimensions';
import { CONTAINER_TOP_PADDING } from '../../transaction-request/styles';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            flex: 1,
            backgroundColor: theme.colors.appBackground,
            paddingTop: CONTAINER_TOP_PADDING
        },
        screenTitle: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.text,
            letterSpacing: LETTER_SPACING,
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: BASE_DIMENSION * 4
        },
        title: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            fontWeight: '600',
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION * 4,
            paddingHorizontal: BASE_DIMENSION * 6,
            textAlign: 'center'
        },
        content: {
            flex: 1
        },
        cardContainer: {
            flexDirection: 'row',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            marginBottom: BASE_DIMENSION * 2,
            marginHorizontal: BASE_DIMENSION * 2,
            paddingVertical: BASE_DIMENSION,
            paddingHorizontal: BASE_DIMENSION
        },
        cardLeftIcon: {
            alignSelf: 'center'
        },
        cardTextContainer: {
            flex: 1,
            flexDirection: 'column',
            paddingRight: BASE_DIMENSION * 2
        },
        topText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION / 2
        },
        middleText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textTertiary
        },
        bottomText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textTertiary
        },
        continueButton: {
            marginHorizontal: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 5
        },
        failedText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.negative,
            alignSelf: 'center'
        },
        successIcon: {
            alignSelf: 'center',
            color: theme.colors.accent
        },
        transactionIconContainer: {
            justifyContent: 'center',
            marginRight: BASE_DIMENSION * 2
        },
        header: {
            flexDirection: 'row',
            width: '100%'
        },
        defaultHeaderContainer: {
            flex: 1
        },
        headerTitleContainer: {
            flex: 1,
            justifyContent: 'center'
        },
        headerTitleStyle: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            color: theme.colors.text,
            letterSpacing: LETTER_SPACING,
            textAlign: 'center',
            fontWeight: 'bold'
        }
    });
