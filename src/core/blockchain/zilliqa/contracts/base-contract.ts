import { ChainIdType, IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';

import { getTokenConfig } from '../../../../redux/tokens/static-selectors';

import { TransactionStatus } from '../../../wallet/types';
import { Contracts } from '../config';
import { Zilliqa } from '..';

export const contracts = {
    '333': {
        [Contracts.STAKING]: '0xa1f40db4f1b598a59cb4894cbe01f690a1c10be1'
    },
    '1': {}
};

export enum ContractFields {
    DEPOSIT_AMT_DELEG = 'deposit_amt_deleg',
    SSNLIST = 'ssnlist',
    MINSTAKE = 'minstake',
    LAST_WITHDRAW_CYCLE_DELEG = 'last_withdraw_cycle_deleg',
    LASTREWARDCYCLE = 'lastrewardcycle',
    LAST_BUF_DEPOSIT_CYCLE_DELEG = 'last_buf_deposit_cycle_deleg'
}

export const fetchContracts = async (chainId: ChainIdType) => {
    // TODO - fetch from blockchain
    return contracts;
};

export const getZilContracts = async (chainId: ChainIdType) => {
    if (!contracts[chainId]) {
        contracts[chainId] = await fetchContracts(chainId);
    }
    return contracts[chainId];
};

export const getContract = async (
    chainId: ChainIdType,
    contractType: Contracts
): Promise<string> => {
    return getZilContracts(chainId).then(zilContracts => zilContracts[contractType]);
};

export const buildBaseTransaction = async (
    tx: IPosTransaction
): Promise<IBlockchainTransaction> => {
    const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

    const client = Zilliqa.getClient(tx.chainId);
    const nonce = await client.getNonce(tx.account.address, tx.account.publicKey);
    const blockInfo = await client.getCurrentBlock();

    return {
        date: {
            created: Date.now(),
            signed: Date.now(),
            broadcasted: Date.now(),
            confirmed: Date.now()
        },
        blockchain: tx.account.blockchain,
        chainId: tx.chainId,
        type: TransactionType.CONTRACT_CALL,
        token: tokenConfig,
        address: tx.account.address,
        publicKey: tx.account.publicKey,
        toAddress: '',
        amount: tx.amount,
        feeOptions: tx.feeOptions,
        broadcastedOnBlock: blockInfo?.number,
        nonce,
        status: TransactionStatus.PENDING,
        data: {},
        additionalInfo: tx.extraFields
    };
};
