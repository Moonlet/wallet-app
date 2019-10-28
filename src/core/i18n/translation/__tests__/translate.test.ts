// import "../locales/en";
import { loadTranslations, translate } from '../translate';
import { translation } from '../locales/en';

jest.mock('../locales/en');

export default describe('Translate utils', () => {
    test('loadTranslations()', async () => {
        expect(await loadTranslations('en')).toEqual(translation);
    });

    describe('translate()', () => {
        test('invalid text', () => {
            expect(translate('Mock.invalid')).toBe('');
        });

        test('simple string', () => {
            expect(translate('Mock.simpleString')).toBe('SIMPLE_STRING');
        });

        test('simpleObject', () => {
            expect(translate('Mock.simpleObject')).toBe('SIMPLE_OBJECT');
        });

        test('simpleParams', () => {
            expect(translate('Mock.simpleParams', { param: 'p1' })).toBe('SIMPLE_PARAMS_p1');
        });

        test('formsDefault', () => {
            (translation as any).__setPluralFnReturn('many');
            expect(translate('Mock.formsDefault')).toBe('FORMS_DEFAULT_DEFAULT');

            (translation as any).__setPluralFnReturn('zero');
            expect(translate('Mock.formsDefault')).toBe('FORMS_DEFAULT_ZERO');
        });

        const cases = ['forms', 'formsOrdinal'];
        const forms = ['zero', 'one', 'two', 'few', 'many'];
        for (const c of cases) {
            test(c, () => {
                for (const form of forms) {
                    (translation as any).__setPluralFnReturn(form);
                    const key =
                        c === 'forms' ? 'FORMS' : c.replace('forms', 'forms_').toUpperCase();
                    expect(translate(`Mock.${c}`, undefined, 2)).toBe(
                        `${key}_${form.toUpperCase()}`
                    );
                }
            });
        }
    });
});
