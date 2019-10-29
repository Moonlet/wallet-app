export interface ITheme {
    dark: boolean;
    shadowGradient: string[];

    fontSize: {
        small: number;
        regular: number;
        large: number;
    };

    colors: {
        settingsDivider: string;
        primary: string;
        accent: string;
        text: string;
        textSecondary: string;
        textTertiary: string;
        positive: string;
        negative: string;

        cardBackground: string;
        appBackground: string;
    };
}
