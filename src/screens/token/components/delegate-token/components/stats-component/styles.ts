import { StyleSheet } from 'react-native';
import {
    BASE_DIMENSION,
    BORDER_RADIUS,
    normalizeFontAndLineHeight
} from '../../../../../../styles/dimensions';
import { ITheme } from '../../../../../../core/theme/itheme';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'column'
        },
        topStatsContainer: {
            flexDirection: 'row',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION,
            justifyContent: 'space-evenly'
        },
        statContainer: {
            flexDirection: 'column'
        },
        statLabelText: {
            fontSize: normalizeFontAndLineHeight(11),
            lineHeight: normalizeFontAndLineHeight(13),
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION / 2,
            textAlign: 'center'
        },
        statValueText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            fontWeight: '600',
            color: theme.colors.text,
            textAlign: 'center'
        },
        accountSummary: {
            marginVertical: BASE_DIMENSION * 2
        }
    });
