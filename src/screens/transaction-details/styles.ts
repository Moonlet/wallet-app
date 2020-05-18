import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight, SCREEN_HEIGHT } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: BASE_DIMENSION * 4,
            paddingBottom: BASE_DIMENSION * 2,
            paddingHorizontal: BASE_DIMENSION * 2,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            height: SCREEN_HEIGHT
        },
        rowContainer: {
            flexDirection: 'column',
            paddingVertical: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        transactionIdContainer: {
            flexDirection: 'row',
            paddingVertical: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        transactionId: {
            flex: 1,
            flexDirection: 'column',
            paddingRight: BASE_DIMENSION * 4
        },
        textPrimary: {
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION / 2
        },
        textSecondary: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.textTertiary
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center'
        }
    });
