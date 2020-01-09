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
        accent: COLORS.AQUA,
        accentSecondary: COLORS.LIGHT_AQUA,

        text: COLORS.GAINSBORO_WHITE,
        textSecondary: COLORS.DARK_GRAY,
        textTertiary: COLORS.DIM_GRAY,

        positive: COLORS.HOT_GREEN,
        negative: COLORS.HOT_RED,
        error: COLORS.LIGHT_RED,
        warning: COLORS.YELLOW,

        cardBackground: COLORS.SHARK_GRAY,
        appBackground: COLORS.COD_GRAY,
        bottomSheetBackground: COLORS.VERY_DARK_GRAY,

        settingsDivider: COLORS.BLACK,
        inputBackground: COLORS.GUN_POWDER_GRAY,
        disabledButton: COLORS.DARK_GRAY,

        gradientLight: COLORS.COD_GRAY,
        gradientDark: COLORS.BLACK
    }
};
