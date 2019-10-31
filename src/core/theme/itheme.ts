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
        text: string;
        textSecondary: string;
        textTertiary: string;
        positive: string;
        negative: string;

        settingsDivider: string;
        cardBackground: string;
        appBackground: string;
        inputBackground: string;
        disabledButton: string;
    };
}
