import { StyleSheet } from 'react-native';
import { ITheme } from '../../../core/theme/itheme';
import { BASE_DIMENSION, normalize, LETTER_SPACING } from '../../../styles/dimensions';

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
            fontSize: normalize(22),
            lineHeight: normalize(28),
            fontWeight: 'bold',
            letterSpacing: LETTER_SPACING,
            color: '#FFFFFF',
            alignSelf: 'center'
        },
        allowText: {
            fontSize: normalize(15),
            lineHeight: normalize(20),
            color: theme.colors.textSecondary
        },
        bottomButtonsContainer: {
            flexDirection: 'row',
            marginTop: BASE_DIMENSION * 3
        },
        bottomText: {
            fontSize: normalize(12),
            lineHeight: normalize(16),
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
            fontSize: normalize(21),
            lineHeight: normalize(25),
            fontWeight: 'bold',
            color: theme.colors.text,
            marginBottom: BASE_DIMENSION * 2,
            marginTop: BASE_DIMENSION * 3
        },
        accountName: {
            fontSize: normalize(18),
            lineHeight: normalize(25),
            fontWeight: '500',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            marginRight: BASE_DIMENSION
        },
        accountAddress: {
            fontSize: normalize(18),
            lineHeight: normalize(25),
            fontWeight: '500',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.accent
        }
    });
