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

        text: COLORS.WHITE_87,
        textSecondary: COLORS.WHITE_67,
        textTertiary: COLORS.WHITE_37,

        positive: COLORS.HOT_GREEN,
        negative: COLORS.HOT_RED,
        error: COLORS.LIGHT_RED,
        warning: COLORS.YELLOW,

        cardBackground: COLORS.GRAY_CARDS,
        appBackground: COLORS.GRAY_PAGE,

        settingsDivider: COLORS.BLACK,

        gradientLight: COLORS.GRAY_PAGE,
        gradientDark: COLORS.BLACK
    }
};
