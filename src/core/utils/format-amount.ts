import { BigNumber } from 'bignumber.js';

import { BLOCKCHAIN_INFO, getBlockchain } from '../blockchain/blockchain-factory';

import { IAccountState } from '../../redux/wallets/state';
import { Blockchain } from '../blockchain/types';

export const formatAmountFromAccount = (account: IAccountState): string => {
    const info = BLOCKCHAIN_INFO[account.blockchain];
    const blockchainInstance = getBlockchain(account.blockchain);
    const value = blockchainInstance.account.amountFromStd(account.balance?.value);
    const decimals = info.decimals;
    return value.toFixed(decimals, BigNumber.ROUND_DOWN);
};

export const amountFromAccount = (account: IAccountState): BigNumber => {
    const blockchainInstance = getBlockchain(account.blockchain);
    return blockchainInstance.account.amountFromStd(account.balance?.value);
};

export const formatAmount = (blockchain: Blockchain, value: BigNumber): BigNumber => {
    const blockchainInstance = getBlockchain(blockchain);
    return blockchainInstance.account.amountFromStd(new BigNumber(value));
};
