export interface ITranslation {
    text: string;
    ordinal?: boolean;
    forms?: {
        zero?: string;
        one?: string;
        two?: string;
        few?: string;
        many?: string;
    };
}

export interface IComponentTranslations {
    [key: string]: IComponentTranslations | ITranslation | string;
}

export interface ITranslations {
    texts: {
        [component: string]: IComponentTranslations;
    };
    plural: PluralFunction;
}

export type PluralFunction = (
    n: number,
    ord?: boolean
) => 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
