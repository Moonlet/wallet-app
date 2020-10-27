import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalizeFontAndLineHeight, normalize } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: BASE_DIMENSION + 2
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
            flex: 0.7,
            justifyContent: 'center',
            alignItems: 'flex-end'
        },
        actionButton: {
            justifyContent: 'center',
            alignItems: 'center',
            height: normalize(50),
            marginRight: BASE_DIMENSION,
            minWidth: normalize(100), // might need a different imp
            borderRadius: BASE_DIMENSION + 2
        },
        actionButtonText: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalizeFontAndLineHeight(22),
            fontWeight: '600'
        }
    });
