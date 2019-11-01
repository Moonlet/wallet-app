import { ITheme } from '../../core/theme/itheme';
import { COLORS } from '../colors';

export const darkTheme: ITheme = {
    dark: true,
    shadowGradient: ['#00000000', '#000000CC'],

    fontSize: {
        small: 12,
        regular: 16,
        large: 20
    },

    colors: {
        primary: COLORS.GRAY,
        accent: COLORS.AQUA,
        text: COLORS.WHITE,
        textSecondary: COLORS.LIGHT_GRAY,
        textTertiary: COLORS.GRAY,
        positive: COLORS.HOT_GREEN,
        negative: COLORS.HOT_RED,

        cardBackground: COLORS.DARK_GRAY,
        appBackground: COLORS.COD_GRAY,
        settingsDivider: COLORS.BLACK,
        inputBackground: COLORS.TUNDORA_GRAY,
        disabledButton: COLORS.LIGHT_GRAY
    }
};
