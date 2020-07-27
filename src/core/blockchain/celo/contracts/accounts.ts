import { Client } from '../client';
import abi from 'ethereumjs-abi';
import { getContract, buildBaseTransaction } from './base-contract';
import { Contracts } from '../config';
import { IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';
import { PosBasicActionType, TokenType } from '../../types/token';

export class Accounts {
    constructor(private client: Client) {}

    public async isRegisteredAccount(accountAddress: string): Promise<boolean> {
        const contractAddress = await getContract(this.client.chainId, Contracts.ACCOUNTS);

        return this.client
            .callContract(contractAddress, 'isAccount(address):(bool)', [accountAddress])
            .then(res => {
                if (res === 'false') return false;
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    public async register(tx: IPosTransaction, address: string): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.ACCOUNTS);

        const raw = '0x' + abi.simpleEncode('register(address)', address).toString('hex');

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: address,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ERC20
        );
        transaction.feeOptions = fees;

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        transaction.data = {
            method: 'register',
            params: [address],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.REGISTER;

        return transaction;
    }
}
