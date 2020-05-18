import { StyleSheet } from 'react-native';
import { ITheme } from '../../core/theme/itheme';
import { BASE_DIMENSION, BORDER_RADIUS, normalizeFontAndLineHeight } from '../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            marginHorizontal: BASE_DIMENSION * 3,
            borderWidth: 1,
            borderColor: theme.colors.accent,
            borderRadius: BORDER_RADIUS,
            flexDirection: 'row',
            alignSelf: 'center'
        },
        tabButton: {
            flexBasis: 0,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: BASE_DIMENSION,
            paddingHorizontal: BASE_DIMENSION * 3
        },
        smallTabButton: {
            paddingVertical: BASE_DIMENSION,
            paddingHorizontal: BASE_DIMENSION * 3
        },
        tabButtonText: {
            fontSize: normalizeFontAndLineHeight(13),
            lineHeight: normalizeFontAndLineHeight(18),
            color: theme.colors.text
        },
        tabButtonSelected: {
            backgroundColor: theme.colors.accent
        },
        tabButtonTextSelected: {
            color: theme.colors.appBackground
        }
    });
