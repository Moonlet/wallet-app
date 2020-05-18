import { StyleSheet } from 'react-native';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalize,
    normalizeFontAndLineHeight
} from '../../../../../../styles/dimensions';
import { ITheme } from '../../../../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
            marginTop: BASE_DIMENSION * 2,
            marginBottom: BASE_DIMENSION * 3
        },
        topStatsContainer: {
            flexDirection: 'row',
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.cardBackground,
            paddingVertical: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION * 3
        },
        chartRowContainer: {
            flexDirection: 'row'
        },
        chartContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        pieStyle: {
            width: normalize(100),
            height: normalize(100),
            flex: 1
        },
        chartView: {
            height: normalize(100),
            width: normalize(100),
            backgroundColor: theme.colors.appBackground,
            marginBottom: BASE_DIMENSION * 2,
            marginRight: BASE_DIMENSION * 2
        },
        chartDetailsContainer: {
            flex: 1
        },
        chartWrapper: {
            flexDirection: 'column',
            marginRight: BASE_DIMENSION * 2
        },
        chartDetailsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: BASE_DIMENSION
        },
        detailRowTitle: {
            lineHeight: normalizeFontAndLineHeight(10),
            flexDirection: 'column'
        },
        chartTextDetailsTitle: {
            fontSize: normalizeFontAndLineHeight(14),
            lineHeight: normalizeFontAndLineHeight(13)
        },
        chartTextDetailsSubTitle: {
            letterSpacing: normalize(4),
            fontSize: normalizeFontAndLineHeight(10),
            lineHeight: normalizeFontAndLineHeight(10)
        },
        chartTextDetails: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.text
        },
        chartTextSecondary: {
            fontSize: normalizeFontAndLineHeight(11),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.text
        },
        statContainer: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center'
        },
        statLabelText: {
            fontSize: normalizeFontAndLineHeight(11),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION / 2
        },
        statValueText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            fontWeight: '600',
            color: theme.colors.text
        },
        percentageText: {
            fontSize: normalizeFontAndLineHeight(8),
            lineHeight: normalizeFontAndLineHeight(12),
            alignSelf: 'center'
        },
        percentageSquare: {
            padding: BASE_DIMENSION / 1.3,
            marginRight: BASE_DIMENSION / 2
        },
        percentageSquareContainer: {
            flex: 0.5,
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: BASE_DIMENSION
        },
        dummyView: {
            height: normalize(100),
            width: normalize(100),
            borderRadius: normalize(50),
            backgroundColor: theme.colors.cardBackground,
            marginBottom: BASE_DIMENSION
        }
    });
