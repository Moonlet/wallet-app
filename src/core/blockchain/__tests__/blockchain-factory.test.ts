import { getBlockchain } from '../blockchain-factory';
import { Blockchain } from '../types';
import { Ethereum } from '../ethereum';
import { Zilliqa } from '../zilliqa';

export default describe('BlochainFactory', () => {
    test('getBlockchain()', () => {
        expect(getBlockchain(Blockchain.ETHEREUM)).toBe(Ethereum);
        expect(getBlockchain(Blockchain.ZILLIQA)).toBe(Zilliqa);

        expect(() => getBlockchain('INVALID_BLOCKCHAIN' as any)).toThrowError(
            'INVALID_BLOCKCHAIN implementation not found'
        );
    });
});
