import { Client } from '../client';
import BigNumber from 'bignumber.js';
import { IPosTransaction, TransactionType, IBlockchainTransaction } from '../../types';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { Celo } from '..';
import abi from 'ethereumjs-abi';
import { TransactionStatus } from '../../../wallet/types';
import { getContractFor } from './get-contracts';
import { Contracts } from '../config';

export class LockedGold {
    constructor(private client: Client) {}

    public async getAccountTotalLockedGold(accountAddress: string): Promise<BigNumber> {
        const contractAddress = await getContractFor(this.client.chainId, Contracts.LOCKED_GOLD);

        return this.client
            .callContract(contractAddress, 'getAccountTotalLockedGold(address):(uint256)', [
                accountAddress
            ])
            .then(v => {
                return new BigNumber(v as string);
            });
    }

    public async buildTransactionForLock(tx: IPosTransaction): Promise<IBlockchainTransaction> {
        const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

        const client = Celo.getClient(tx.chainId);
        const nonce = await client.getNonce(tx.account.address, tx.account.publicKey);
        const blockInfo = await client.getCurrentBlock();
        const contractAddress = await getContractFor(this.client.chainId, Contracts.LOCKED_GOLD);

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
            toAddress: contractAddress,
            amount: tx.amount,
            feeOptions: tx.feeOptions,
            broadcastedOnBlock: blockInfo?.number,
            nonce,
            status: TransactionStatus.PENDING,
            data: {
                method: 'lock',
                params: [tx.amount],
                raw: '0x' + abi.simpleEncode('lock()').toString('hex')
            }
        };
    }
}
