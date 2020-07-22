import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    SCREEN_HEIGHT,
    normalizeFontAndLineHeight,
    BORDER_RADIUS
} from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingTop: BASE_DIMENSION * 4,
            paddingBottom: BASE_DIMENSION * 5,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT // used for web
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
            marginBottom: BASE_DIMENSION,
            paddingVertical: BASE_DIMENSION * 2,
            paddingHorizontal: BASE_DIMENSION * 2
        },
        cardLeftIcon: {
            alignSelf: 'center',
            marginRight: BASE_DIMENSION * 2
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
            marginHorizontal: BASE_DIMENSION * 2
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
        }
    });
