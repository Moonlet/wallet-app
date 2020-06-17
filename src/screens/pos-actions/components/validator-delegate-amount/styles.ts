import { StyleSheet } from 'react-native';
import { ITheme } from '../../../../core/theme/itheme';
import {
    BASE_DIMENSION,
    ICON_CONTAINER_SIZE,
    normalizeFontAndLineHeight,
    LETTER_SPACING
} from '../../../../styles/dimensions';

export default (theme: ITheme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            padding: BASE_DIMENSION + BASE_DIMENSION / 2,
            paddingHorizontal: BASE_DIMENSION * 3
        },
        icon: {
            width: ICON_CONTAINER_SIZE,
            height: ICON_CONTAINER_SIZE,
            borderRadius: ICON_CONTAINER_SIZE,
            alignSelf: 'center',
            marginRight: BASE_DIMENSION + BASE_DIMENSION / 2
        },
        labelContainer: {
            flexDirection: 'row',
            alignItems: 'baseline',
            marginBottom: BASE_DIMENSION / 2
        },
        labelName: {
            fontSize: normalizeFontAndLineHeight(16),
            fontWeight: '500',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.text,
            textAlign: 'center',
            marginRight: BASE_DIMENSION / 2
        },
        website: {
            fontSize: normalizeFontAndLineHeight(11),
            color: theme.colors.textSecondary
        },
        rankText: {
            fontSize: normalizeFontAndLineHeight(10),
            color: theme.colors.textTertiary
        },
        amount: {
            fontSize: normalizeFontAndLineHeight(14),
            lineHeight: normalizeFontAndLineHeight(19),
            fontWeight: '500',
            letterSpacing: LETTER_SPACING,
            color: theme.colors.textSecondary,
            alignSelf: 'center'
        }
    });
