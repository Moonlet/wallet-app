export interface ITheme {
    dark: boolean;
    shadowGradient: string[];

    fontSize: {
        small: number;
        regular: number;
        large: number;
    };

    colors: {
        accent: string;
        accentSecondary: string;

        text: string;
        textSecondary: string;
        textTertiary: string;

        positive: string;
        negative: string;
        error: string;
        warning: string;

        cardBackground: string;
        appBackground: string;

        settingsDivider: string;

        gradientLight: string;
        gradientDark: string;
    };
}
