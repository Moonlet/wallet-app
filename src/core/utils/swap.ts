import { IBlockchainTransaction } from '../blockchain/types';
import { ContractMethod } from '../blockchain/types/token';

export const isSwapTx = (tx: IBlockchainTransaction): boolean => {
    return (
        tx.additionalInfo?.swap &&
        (tx.additionalInfo?.swap.contractMethod === ContractMethod.SWAP_EXACT_TOKENS_FOR_ZIL ||
            tx.additionalInfo?.swap.contractMethod === ContractMethod.SWAP_EXACT_ZIL_FOR_TOKENS ||
            tx.additionalInfo?.swap.contractMethod === ContractMethod.SWAP_EXACT_TOKENS_FOR_TOKENS)
    );
};
