const mock: any = jest.genMockFromModule('../en');
let pluralFnReturn = 'many';

mock.translation.texts.Mock = {
    simpleString: 'SIMPLE_STRING',
    simpleObject: {
        text: 'SIMPLE_OBJECT'
    },
    simpleParams: 'SIMPLE_PARAMS_{{param}}',
    formsDefault: {
        text: 'FORMS_DEFAULT_DEFAULT',
        forms: {
            zero: 'FORMS_DEFAULT_ZERO'
        }
    },
    forms: {
        text: 'FORMS_DEFAULT',
        ordinal: false,
        forms: {
            zero: 'FORMS_ZERO',
            one: 'FORMS_ONE',
            two: 'FORMS_TWO',
            few: 'FORMS_FEW',
            many: 'FORMS_MANY'
        }
    },
    formsOrdinal: {
        text: 'FORMS_ORDINAL_DEFAULT',
        ordinal: true,
        forms: {
            zero: 'FORMS_ORDINAL_ZERO',
            one: 'FORMS_ORDINAL_ONE',
            two: 'FORMS_ORDINAL_TWO',
            few: 'FORMS_ORDINAL_FEW',
            many: 'FORMS_ORDINAL_MANY'
        }
    }
};

mock.translation.plural = jest.fn(() => pluralFnReturn);

mock.translation.__setPluralFnReturn = (value: any) => (pluralFnReturn = value);

export const translation = mock.translation;
