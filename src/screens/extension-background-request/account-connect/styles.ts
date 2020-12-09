import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    LETTER_SPACING,
    normalizeFontAndLineHeight
} from '../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            backgroundColor: theme.colors.appBackground,
            paddingHorizontal: BASE_DIMENSION * 2,
            paddingBottom: BASE_DIMENSION * 2 + BASE_DIMENSION / 2
        },
        headerContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: BASE_DIMENSION * 4,
            marginBottom: BASE_DIMENSION * 2 + BASE_DIMENSION / 2
        },
        headerTitle: {
            fontSize: normalizeFontAndLineHeight(22),
            lineHeight: normalizeFontAndLineHeight(28),
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            alignSelf: 'center'
        },
        allowText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary
        },
        bottomButtonsContainer: {
            flexDirection: 'row',
            marginTop: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        bottomText: {
            fontSize: normalizeFontAndLineHeight(12),
            lineHeight: normalizeFontAndLineHeight(16),
            color: theme.colors.textTertiary
        },
        bottomLeftButton: {
            flex: 1,
            marginRight: BASE_DIMENSION / 2
        },
        bottomRightButton: {
            flex: 1,
            marginLeft: BASE_DIMENSION / 2
        },
        sectionLabel: {
            fontSize: normalizeFontAndLineHeight(21),
            lineHeight: normalizeFontAndLineHeight(25),
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION * 3
        },
        accountName: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            fontWeight: '500',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            marginRight: BASE_DIMENSION
        },
        accountAddress: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(25),
            fontWeight: '500',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.accent
        },
        firstRow: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION / 4
        },
        amountContainer: {
            flexDirection: 'row',
            alignItems: 'baseline'
        },
        amountText: {
            color: theme.colors.textSecondary
        },
        amountConvertedText: {
            marginLeft: BASE_DIMENSION,
            color: theme.colors.textSecondary
        }
    });
