export interface ITheme {
    dark: boolean;
    shadowGradient: string[];

    fontSize: {
        small: number;
        regular: number;
        large: number;
    };

    colors: {
        primary: string;
        accent: string;
        accentSecondary: string;
        text: string;
        textSecondary: string;
        textTertiary: string;
        positive: string;
        negative: string;
        error: string;
        warning: string;

        settingsDivider: string;
        cardBackground: string;
        cardBackgroundSecondary: string;
        appBackground: string;
        inputBackground: string;
        disabledButton: string;
        modalBackground: string;
        headerBackground: string;

        gradientLight: string;
        gradientDark: string;
    };
}
