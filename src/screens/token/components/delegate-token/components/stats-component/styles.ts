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
            flexWrap: 'wrap',
            backgroundColor: theme.colors.cardBackground,
            borderRadius: BORDER_RADIUS,
            paddingVertical: BASE_DIMENSION
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
        }
    });
