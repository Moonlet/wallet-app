import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, normalize, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            height: normalize(22),
            width: '100%',
            backgroundColor: theme.colors.accent,
            justifyContent: 'center'
        },
        text: {
            fontSize: normalizeFontAndLineHeight(14),
            lineHeight: normalizeFontAndLineHeight(20),
            color: theme.colors.black,
            textAlign: 'center'
        },
        icon: {
            alignSelf: 'center',
            color: theme.colors.black,
            marginHorizontal: BASE_DIMENSION / 2
        }
    });
