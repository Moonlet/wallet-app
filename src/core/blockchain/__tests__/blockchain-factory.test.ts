import { BlockchainFactory } from '../blockchain-factory';
import { Blockchain } from '../types';
import { Ethereum } from '../ethereum';
import { Zilliqa } from '../zilliqa';

export default describe('Blochain factory', () => {
    it('should return correct blockchian instance', () => {
        expect(BlockchainFactory.get(Blockchain.ETHEREUM) instanceof Ethereum).toBe(true);
        expect(BlockchainFactory.get(Blockchain.ZILLIQA) instanceof Zilliqa).toBe(true);

        expect(() => BlockchainFactory.get('INVALID_BLOCKCHAIN' as any)).toThrowError(
            'INVALID_BLOCKCHAIN implementation not found'
        );
    });
});
