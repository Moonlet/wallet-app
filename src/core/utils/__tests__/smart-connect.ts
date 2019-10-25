import { smartConnect } from '../smart-connect';

export default describe('Core Util Smart connect', () => {
    test('works corectly', () => {
        const mocks = [jest.fn(a => a + '0'), jest.fn(a => a + '1'), jest.fn(a => a + '2')];
        expect(smartConnect('C', mocks)).toBe('C012');
        expect(smartConnect('C')).toBe('C');
    });
});
