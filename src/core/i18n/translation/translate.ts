import { ITranslations, ITranslation } from './types';

/**
 * Plural specs:
 * http://www.unicode.org/cldr/charts/28/supplemental/language_plural_rules.html
 */
export interface ITranslationParams {
    [key: string]: any;
}

export type Language = 'en';

const store: {
    language: Language;
    translations: ITranslations;
} = {
    language: undefined as any,
    translations: undefined as any
};

export const loadTranslations = (language: Language) => {
    let promise;
    switch (language) {
        case 'en':
        default:
            promise = import('./locales/en' /* webpackChunkName = "translations/en" */);
    }

    return promise.then(mod => {
        store.language = language;
        store.translations = mod.translation;
        return mod.translation;
    });
};

const getKeyConfig = (key: string): ITranslation | string => {
    const keyParts = key.split('.');
    let config = store?.translations?.texts as any;

    for (const keyPart of keyParts) {
        if (config && config[keyPart]) {
            config = config[keyPart];
        } else {
            config = undefined;
            break;
        }
    }

    return config;
};

const format = (text: string, params?: ITranslationParams): string => {
    if (params) {
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                text = text.replace(new RegExp('{{' + key + '}}', 'g'), String(params[key]));
            }
        }
    }

    return text;
};

export const translate = (key: string, params?: ITranslationParams, count: number = 0) => {
    const translationConfig = getKeyConfig(key);

    if (translationConfig) {
        if (typeof translationConfig === 'string') {
            return format(translationConfig, params);
        }

        const plural = store.translations.plural(count, translationConfig.ordinal);
        const forms: any = translationConfig.forms;
        if (translationConfig.forms && forms[plural]) {
            return format(forms[plural], params);
        } else {
            return format(translationConfig.text, params);
        }
    } else {
        return '';
    }
};
