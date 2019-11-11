import { Ethereum } from '../';

describe('Ethereum', () => {
    test('client getter', () => {
        expect(Ethereum.getClient(1)).toBeInstanceOf(Ethereum.Client);
    });
});
