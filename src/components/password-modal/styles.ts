import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        wrongPasswordContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000000BF',
            justifyContent: 'center',
            paddingHorizontal: BASE_DIMENSION * 4
        },
        moonletDisabled: {
            fontSize: normalizeFontAndLineHeight(34),
            lineHeight: normalize(41),
            color: theme.colors.textSecondary,
            marginBottom: BASE_DIMENSION / 2,
            textAlign: 'center',
            letterSpacing: 0.35
        },
        disabledDetails: {
            fontSize: normalizeFontAndLineHeight(17),
            lineHeight: normalize(22),
            color: theme.colors.textSecondary,
            textAlign: 'center'
        }
    });
