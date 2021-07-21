import SolanaApp from './solana-interface';
import { IHardwareWalletApp } from '../types';
import { IBlockchainTransaction } from '../../../../blockchain/types';
import { StakeProgram } from '@solana/web3.js/src/stake-program';
import { Transaction } from '@solana/web3.js/src/transaction';
import { SolanaTransactionInstructionType } from '../../../../blockchain/solana/types';
import { PublicKey } from '@solana/web3.js/src/publickey';
import bs58 from 'bs58';
import { Solana as SolanaBlockchain } from '../.././../../blockchain/solana/index';
import { Client as SolanaClient } from '../.././../../blockchain/solana/client';

export class Solana implements IHardwareWalletApp {
    private app = null;
    constructor(transport) {
        this.app = new SolanaApp.default(transport);
    }

    /**
     * @param {number} index index of account
     * @param {number} derivationIndex index of derivation for an account
     * @param {number} path derivation path, values accepted: live, legacy
     */
    public async getAddress(index: number, derivationIndex: number = 0, path: string) {
        const pubkeyBytes = await this.app.solana_ledger_get_pubkey();
        const pubkey = bs58.encode(pubkeyBytes);
        return {
            address: pubkey,
            publicKey: pubkey
        };
    }

    public signTransaction = async (
        index: number,
        derivationIndex: number = 0,
        path: string,
        tx: IBlockchainTransaction
    ): Promise<any> => {
        const client = SolanaBlockchain.getClient(tx.chainId) as SolanaClient;

        let transaction: Transaction;

        switch (tx.additionalInfo.type) {
            case SolanaTransactionInstructionType.CREATE_ACCOUNT_WITH_SEED:
                transaction = StakeProgram.createAccountWithSeed(tx.additionalInfo.instructions[0]);
                break;
            case SolanaTransactionInstructionType.DELEGATE_STAKE:
                transaction = StakeProgram.delegate(tx.additionalInfo.instructions[0]);
                break;
            case SolanaTransactionInstructionType.UNSTAKE:
                transaction = StakeProgram.deactivate(tx.additionalInfo.instructions[0]);
                break;
            case SolanaTransactionInstructionType.SPLIT_STAKE:
                transaction = tx.additionalInfo.splitTransaction;
                break;
            case SolanaTransactionInstructionType.WITHDRAW:
                transaction = StakeProgram.withdraw(tx.additionalInfo.instructions[0]);
                break;

            case SolanaTransactionInstructionType.TRANSFER:
                transaction = new Transaction();
                for (const i of tx.additionalInfo.instructions) {
                    transaction.add(i);
                }
                break;
        }

        const addressPublicKey = new PublicKey(tx.address);

        transaction.recentBlockhash = await client.getCurrentBlockHash();
        transaction.feePayer = addressPublicKey;

        const sigBytes = await this.app.solana_ledger_sign_transaction(transaction);

        transaction.addSignature(addressPublicKey, sigBytes);
        return transaction.serialize();
    };

    public async getInfo() {
        return this.app.solana_ledger_get_version();
    }

    public signMessage = async (
        index: number,
        derivationIndex: number,
        path: string,
        message: string
    ): Promise<any> => {
        throw new Error('signMessage NOT IMPLEMENTED');
    };
}
