import {
    IBlockchainTransaction,
    ITransferTransaction,
    TransactionType,
    IBlockchainTransactionUtils
} from '../types';
import secp256k1 from 'secp256k1/elliptic';
import { createHash } from 'crypto';
import { TransactionStatus } from '../../wallet/types';
import { config } from './config';
import { Client as CosmosClient } from './client';
import { Cosmos } from '.';
import { BigNumber } from 'bignumber.js';
import { sortObject } from '../../utils/sort-object';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';

export class CosmosTransactionUtils implements IBlockchainTransactionUtils {
    public sign = async (tx: IBlockchainTransaction, privateKey: string): Promise<any> => {
        const hash = createHash('sha256')
            .update(JSON.stringify(sortObject(tx.additionalInfo.stdSignMsg)))
            .digest('hex');
        const buf = Buffer.from(hash, 'hex');
        const bufferPrivateKey = Buffer.from(privateKey, 'hex');

        const signObj = secp256k1.sign(buf, bufferPrivateKey);
        const signatureBase64 = Buffer.from(signObj.signature, 'binary').toString('base64');
        const publicBase64 = Buffer.from(tx.publicKey, 'hex').toString('base64');

        const signedTx = {
            tx: {
                msg: tx.additionalInfo.stdSignMsg.msgs,
                fee: tx.additionalInfo.stdSignMsg.fee,
                signatures: [
                    {
                        signature: signatureBase64,
                        pub_key: {
                            type: 'tendermint/PubKeySecp256k1',
                            value: publicBase64
                        }
                    }
                ],
                memo: tx.additionalInfo.memo
            },
            // The supported return types includes "block"(return after tx commit), "sync"(return afer CheckTx) and "async"(return right away).
            mode: 'sync'
        };
        return signedTx;
    };

    public buildTransferTransaction = async (
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction> => {
        const client = Cosmos.getClient(tx.chainId) as CosmosClient;
        const accountInfo = await client.getAccountInfo(tx.account.address);
        const blockInfo = await client.getCurrentBlock();
        let denom = config.defaultUnit.toLowerCase();
        const symbolMap = config.tokens[tx.chainId][config.coin].symbolMap;
        if (symbolMap !== undefined) {
            Object.keys(symbolMap).map(key => {
                if (key === tx.chainId) {
                    denom = symbolMap[key];
                }
            });
        }

        const gasAmount = new BigNumber(tx.feeOptions.gasPrice).multipliedBy(
            tx.feeOptions.gasLimit
        );

        const stdSignMsg = {
            msgs: [
                {
                    type: 'cosmos-sdk/MsgSend',
                    value: {
                        amount: [
                            {
                                amount: tx.amount, // 6 decimal places (1000000 uatom = 1 ATOM)
                                denom
                            }
                        ],
                        from_address: tx.account.address,
                        to_address: tx.toAddress
                    }
                }
            ],
            fee: {
                amount: [{ amount: gasAmount.toString(), denom }],
                gas: tx.feeOptions.gasLimit
            },
            memo: '',
            chain_id: tx.chainId,
            account_number: accountInfo.account_number,
            sequence: accountInfo.sequence
        };

        const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

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
            token: tokenConfig,
            address: tx.account.address,
            publicKey: tx.account.publicKey,
            toAddress: tx.toAddress,
            amount: tx.amount,
            feeOptions: tx.feeOptions,
            broadcastedOnBlock: blockInfo?.number,
            nonce: accountInfo.sequence,
            status: TransactionStatus.PENDING,
            additionalInfo: {
                account_number: accountInfo.account_number,
                memo: tx.extraFields.memo,
                stdSignMsg
            }
        };
    };

    public getTransactionAmount = (tx: IBlockchainTransaction): string => {
        return tx.amount;
    };
    public getTransactionStatusByCode = (status): TransactionStatus => {
        switch (parseInt(status, 16)) {
            case 0:
                return TransactionStatus.FAILED;
            case 1:
                return TransactionStatus.SUCCESS;
            case 2:
                return TransactionStatus.PENDING;
            default:
                return TransactionStatus.FAILED;
        }
    };
}
