import { IBlockchainTransaction, ITransferTransaction, TransactionType } from '../types';
import { INearTransactionAdditionalInfoType, NearTransactionActionType, Near } from './';
import { TransactionStatus } from '../../wallet/types';

import { transfer, createTransaction, signTransaction } from 'nearlib/src.ts/transaction';
import { KeyPair, PublicKey } from 'nearlib/src.ts/utils/key_pair';
import { base_decode } from 'nearlib/src.ts/utils/serialize';
import BN from 'bn.js';
import sha256 from 'js-sha256';

export const sign = async (
    tx: IBlockchainTransaction<INearTransactionAdditionalInfoType>,
    privateKey: string
): Promise<any> => {
    // transaction actions
    const actions = tx.additionalInfo.actions
        .map(action => {
            switch (action.type) {
                case NearTransactionActionType.TRANSFER:
                    return transfer(new BN(tx.amount));
                default:
                    return false;
            }
        })
        .filter(Boolean);

    // setup KeyPair
    const keyPair = KeyPair.fromString(privateKey);

    // create transaction
    const nearTx = createTransaction(
        tx.address,
        PublicKey.fromString(tx.publicKey),
        tx.toAddress,
        tx.nonce,
        actions as any,
        base_decode(tx.additionalInfo.currentBlockHash)
    );

    // sign transaction
    const signer: any = {
        async signMessage(message) {
            const hash = new Uint8Array(sha256.sha256.array(message));
            return keyPair.sign(hash);
        }
    };
    const signedTx = await signTransaction(nearTx, signer, tx.address, tx.chainId as string);
    return Buffer.from(signedTx[1].encode()).toString('base64');
};

export const buildTransferTransaction = async (
    tx: ITransferTransaction
): Promise<IBlockchainTransaction<INearTransactionAdditionalInfoType>> => {
    const client = Near.getClient(tx.chainId);
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
        type: TransactionType.TRANSFER,
        token: tx.account.tokens[tx.token],

        address: tx.account.address,
        publicKey: tx.account.publicKey,

        toAddress: tx.toAddress,
        amount: tx.amount,
        feeOptions: tx.feeOptions,
        broadcatedOnBlock: undefined,
        nonce,
        status: TransactionStatus.PENDING,
        additionalInfo: {
            currentBlockHash: blockInfo.hash,
            actions: [
                {
                    type: NearTransactionActionType.TRANSFER
                }
            ]
        }
    };
};

export const getTransactionAmount = (tx: IBlockchainTransaction): string => {
    return tx.amount;
};
