import { IClientUtils } from '../types/client-utils';
import { Client } from './client';
import { IBlockchainTransaction, Blockchain, TransactionType } from '../types';
import { TransactionInstruction } from '@solana/web3.js/src/transaction';
import { SystemInstruction } from '@solana/web3.js/src/system-program';
import { StakeInstruction } from '@solana/web3.js/src/stake-program';
import { config } from './config';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { TransactionStatus } from '../../wallet/types';
import { PublicKey } from '@solana/web3.js/src/publickey';
import { decode as bs58Decode } from 'bs58';

export class ClientUtils implements IClientUtils {
    constructor(private client: Client) {}

    async getTransaction(
        hash: string,
        options: { address: string }
    ): Promise<IBlockchainTransaction> {
        return (
            this.client.http
                // TODO: migrate to `getTransaction` before mainnet update to 1.8
                .jsonRpc('getConfirmedTransaction', [hash, 'json'])
                .then(response =>
                    this.buildTransactionFromBlockchain(response.result, options.address)
                )
        );
    }

    async buildTransactionFromBlockchain(txData, address: string): Promise<IBlockchainTransaction> {
        const token = config.tokens.SOL;
        let toAddress = '';
        let fromAddress = '';
        let amount = '';

        if (!txData?.transaction) {
            throw new Error('SOL invalid txData');
        }

        // for transfer - TBD for the rest
        const accountKeys = txData.transaction.message.accountKeys;
        if (accountKeys[0].toLowerCase() === address.toLowerCase()) {
            toAddress = accountKeys[1];
            fromAddress = accountKeys[0];
        }

        // TODO - change this when multiple instructions
        const instruction = txData.transaction.message.instructions[0];

        const programId =
            accountKeys.length >= instruction.programIdIndex
                ? new PublicKey(accountKeys[instruction.programIdIndex])
                : new PublicKey('11111111111111111111111111111111');

        const txInstruction: TransactionInstruction = {
            data: Buffer.from(bs58Decode(instruction.data)),
            programId,
            keys: [] // TODO [new PublicKey(fromAddress), new PublicKey(toAddress), programId]
        };

        let type = '';
        try {
            type = SystemInstruction.decodeInstructionType(txInstruction);
        } catch {
            type = undefined;
        }
        if (type === undefined) {
            try {
                type = StakeInstruction.decodeInstructionType(txInstruction);
            } catch {
                type = undefined;
            }
        }

        if (type && type === 'Transfer') {
            const transfer = SystemInstruction.decodeTransfer(txInstruction);
            amount = transfer.lamports.toString();
        }
        // TODO
        // else if (type && type === 'Delegate') {
        //     const delegate = StakeInstruction.decodeDelegate(txInstruction);
        // }
        const data: any = {};

        return {
            id: txData.transaction.signatures[0],
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: Blockchain.SOLANA,
            chainId: this.client.chainId,
            type: type === 'Transfer' ? TransactionType.TRANSFER : TransactionType.CONTRACT_CALL,

            address: fromAddress,
            publicKey: fromAddress,
            toAddress,
            amount,
            data,
            feeOptions: {
                gasPrice: '',
                gasLimit: '',
                feeTotal: txData.meta.fee
            },
            broadcastedOnBlock: txData.slot,
            nonce: undefined,
            status: await this.getTransactionStatus(txData.transaction.signatures[0], {
                txData,
                token
            }),
            token
        };
    }

    public async getTransactionStatus(
        hash: string,
        context?: {
            txData?: any;
            broadcastedOnBlock?: number;
            currentBlockNumber?: number;
            token?: ITokenConfigState;
        }
    ): Promise<TransactionStatus> {
        let status = TransactionStatus.PENDING;

        if (context?.txData) {
            status =
                !context?.txData?.meta?.err === null
                    ? TransactionStatus.SUCCESS
                    : TransactionStatus.FAILED;
        } else {
            let confirmedTxRes;

            try {
                // supported for solana-core v1.7 or newer
                confirmedTxRes = await this.client.http.jsonRpc('getTransaction', [hash, 'json']);
                if (String(confirmedTxRes?.error?.message).includes('Method not found')) {
                    // reset this to use fallback on older version
                    confirmedTxRes = null;
                }
            } catch {
                // reset this to use fallback on older version
                confirmedTxRes = null;
            }

            if (!confirmedTxRes) {
                try {
                    // fallback, deprecated, expected to be removed in solana-core v1.8
                    confirmedTxRes = await this.client.http.jsonRpc('getConfirmedTransaction', [
                        hash,
                        'json'
                    ]);
                } catch (error) {
                    // TODO: consider implementing dropped status
                }
            }

            if (confirmedTxRes?.result?.meta) {
                status =
                    confirmedTxRes?.result?.meta?.err === null
                        ? TransactionStatus.SUCCESS
                        : TransactionStatus.FAILED;
            } else {
                // TODO: consider implementing dropped status
            }
        }

        return status;
    }
}
