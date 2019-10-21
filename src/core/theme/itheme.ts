export interface ITheme {
    dark: boolean;

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
    };
}
