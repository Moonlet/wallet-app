import { ITheme } from '../../core/theme/itheme';
import { COLORS } from '../colors';

export const darkTheme: ITheme = {
    dark: true,

    fontSize: {
        small: 12,
        regular: 16,
        large: 34
    },

    colors: {
        primary: COLORS.GRAY,
        accent: COLORS.AQUA,
        text: COLORS.WHITE,
        textDarker: COLORS.LIGHT_GRAY,
        positive: COLORS.HOT_GREEN,
        negative: COLORS.HOT_RED,

        cardBackground: COLORS.DARK_GRAY
    }
};
