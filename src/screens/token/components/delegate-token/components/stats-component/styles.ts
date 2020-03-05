import { StyleSheet } from 'react-native';
import { BASE_DIMENSION, BORDER_RADIUS } from '../../../../../../styles/dimensions';
import { ITheme } from '../../../../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            marginTop: BASE_DIMENSION * 2
        },
        topStatsContainer: {
            flexDirection: 'row',
            borderRadius: BORDER_RADIUS,
            backgroundColor: theme.colors.cardBackground,
            paddingVertical: BASE_DIMENSION,
            marginBottom: BASE_DIMENSION * 2
        },
        chartRowContainer: {
            flexDirection: 'row'
        },
        chartContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        pieStyle: {
            width: 100,
            height: 100,
            flex: 1
        },
        chartView: {
            height: 100,
            width: 100,
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
        chartTextDetails: {
            fontSize: 13,
            lineHeight: 18,
            color: theme.colors.text
        },
        chartTextSecondary: {
            fontSize: 11,
            lineHeight: 13,
            color: theme.colors.text
        },
        statContainer: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center'
        },
        statLabelText: {
            fontSize: 11,
            lineHeight: 13,
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION / 2
        },
        statValueText: {
            fontSize: 17,
            lineHeight: 22,
            fontWeight: '600',
            color: theme.colors.text
        },
        percentageText: {
            fontSize: 8,
            lineHeight: 12,
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
        }
    });
