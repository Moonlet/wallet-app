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
        textDarker: string;
        positive: string;
        negative: string;

        cardBackground: string;
        appBackground: string;
    };
}
