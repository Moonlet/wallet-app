import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    normalizeFontAndLineHeight,
    normalize
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: BASE_DIMENSION + 2,
            paddingHorizontal: BASE_DIMENSION
        },
        generalFlex: {
            flex: 1
        },
        firstLineText: {
            marginBottom: BASE_DIMENSION,
            color: theme.colors.text,
            fontSize: normalizeFontAndLineHeight(16),
            lineHeight: normalizeFontAndLineHeight(25)
        },
        secondLine: {
            marginBottom: BASE_DIMENSION / 4,
            color: theme.colors.textSecondary,
            fontSize: normalizeFontAndLineHeight(14),
            fontWeight: '400',
            lineHeight: normalizeFontAndLineHeight(20)
        },
        thirdLine: {
            color: theme.colors.textSecondary
        },
        actionButtonContainer: {
            flex: 0.5,
            justifyContent: 'center'
        },
        actionButton: {
            height: normalize(60)
        },
        actionButtonText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            fontWeight: '600'
        }
    });
