import { BlockchainFactory } from '../blockchain-factory';
import { Blockchain } from '../types';
import { Ethereum } from '../ethereum';
import { Zilliqa } from '../zilliqa';

export default describe('BlochainFactory', () => {
    test('get()', () => {
        expect(BlockchainFactory.get(Blockchain.ETHEREUM)).toBeInstanceOf(Ethereum);
        expect(BlockchainFactory.get(Blockchain.ZILLIQA)).toBeInstanceOf(Zilliqa);

        expect(() => BlockchainFactory.get('INVALID_BLOCKCHAIN' as any)).toThrowError(
            'INVALID_BLOCKCHAIN implementation not found'
        );
    });
});
