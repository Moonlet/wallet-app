import { BigNumber } from 'bignumber.js';

import { getBlockchain } from '../blockchain/blockchain-factory';

import { Blockchain } from '../blockchain/types';

export const formatAmount = (blockchain: Blockchain, value: BigNumber): BigNumber => {
    const blockchainInstance = getBlockchain(blockchain);
    return blockchainInstance.account.amountFromStd(new BigNumber(value));
};
