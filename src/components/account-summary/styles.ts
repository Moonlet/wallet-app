import { StyleSheet } from 'react-native';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    LETTER_SPACING,
    normalize,
    normalizeFontAndLineHeight
} from '../../styles/dimensions';
import { ITheme } from '../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'column'
        },
        summaryContainer: {
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingBottom: BASE_DIMENSION,
            paddingHorizontal: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        topContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        summaryText: {
            fontSize: normalizeFontAndLineHeight(18),
            lineHeight: normalizeFontAndLineHeight(22),
            color: theme.colors.text,
            alignSelf: 'center'
        },
        summaryTextExpandedDisabled: {
            marginTop: BASE_DIMENSION / 2,
            marginBottom: BASE_DIMENSION
        },
        icon: {
            color: theme.colors.accent,
            alignSelf: 'center',
            padding: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        barContainer: {
            flexDirection: 'row',
            width: '100%',
            backgroundColor: theme.colors.textSecondary,
            height: normalize(20),
            marginBottom: BASE_DIMENSION * 2
        },
        barCard: {
            height: normalize(20)
        },
        topStatsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap'
        },
        percentageSquareContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: BASE_DIMENSION,
            marginRight: BASE_DIMENSION * 2
        },
        percentageSquare: {
            padding: BASE_DIMENSION / 1.3,
            marginRight: BASE_DIMENSION / 2
        },
        percentageText: {
            fontSize: normalizeFontAndLineHeight(9),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.text,
            alignSelf: 'center'
        },
        percengateSkeleton: {
            height: normalize(20),
            width: normalize(80),
            marginBottom: BASE_DIMENSION,
            marginRight: BASE_DIMENSION * 2
        },
        detailsContainer: {
            flexDirection: 'row',
            marginTop: BASE_DIMENSION * 2,
            flexWrap: 'wrap'
        },
        detailsStatContainer: {
            flex: 1,
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2
        },
        detailsStatIconContainer: {
            width: normalize(36),
            height: normalize(36),
            backgroundColor: theme.colors.black + '40', // 25% opacity
            borderRadius: BORDER_RADIUS,
            justifyContent: 'center',
            marginRight: BASE_DIMENSION,
            alignSelf: 'center'
        },
        detailsPrimaryText: {
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(21),
            color: theme.colors.white
        },
        detailsSecondaryText: {
            fontSize: normalizeFontAndLineHeight(15),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.textSecondary
        },
        detailsExtraContainer: {
            flexDirection: 'column'
        },
        divider: {
            width: '100%',
            height: 1,
            backgroundColor: theme.colors.inputBackground
        },
        detailsExtraTextContainer: {
            flexDirection: 'row',
            marginTop: BASE_DIMENSION * 2 + BASE_DIMENSION / 2,
            justifyContent: 'center',
            marginBottom: BASE_DIMENSION * 2
        },
        detailsExtraText: {
            fontSize: normalizeFontAndLineHeight(23),
            lineHeight: normalizeFontAndLineHeight(34),
            color: theme.colors.white,
            letterSpacing: LETTER_SPACING
        },
        detailsSkeletonComp: {
            flexDirection: 'row',
            marginBottom: BASE_DIMENSION * 2,
            marginRight: BASE_DIMENSION * 2
        },
        detailsSkeletonIcon: {
            width: normalize(36),
            height: normalize(36),
            borderRadius: BORDER_RADIUS,
            marginRight: BASE_DIMENSION
        },
        detailsSkeletonPrimaryValue: {
            height: normalize(14),
            width: normalize(100)
        },
        detailsSkeletonSecondaryValue: {
            height: normalize(12),
            width: normalize(80)
        }
    });
