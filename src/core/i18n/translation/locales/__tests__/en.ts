import { translation } from '../en';

const testCases = [
    [0, false, 'other'],
    [1, false, 'one'],
    [0, true, 'other'],
    [1, true, 'one'],
    [2, true, 'two'],
    [3, true, 'few'],
    [4, true, 'other']
];
describe('EN locale', () => {
    test('plural function', () => {
        for (const testCase of testCases) {
            expect(translation.plural(testCase[0] as number, testCase[1] as boolean)).toBe(
                testCase[2]
            );
        }
    });
});
