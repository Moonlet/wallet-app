import { IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { TransactionStatus } from '../../../wallet/types';
import { Client as SolanaClient } from '../client';
import { Solana } from '..';
import { IStakeAccountFormat } from '../types';
import { PosBasicActionType } from '../../types/token';
import CryptoJS from 'crypto-js';
import bs58 from 'bs58';
import BigNumber from 'bignumber.js';

export const stakeProgramId = 'Stake11111111111111111111111111111111111111';
export const programId = '11111111111111111111111111111111111111';

export const buildBaseTransaction = async (
    tx: IPosTransaction
): Promise<IBlockchainTransaction> => {
    const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

    const client = Solana.getClient(tx.chainId) as SolanaClient;
    const nonce = 1;

    const blockHash = await client.getCurrentBlockHash();
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
        additionalInfo: {
            currentBlockHash: blockHash
        }
    };
};

function hash(h, v) {
    h.update(CryptoJS.lib.WordArray.create(Buffer.from(v)));
}

export const generateStakeAccount = (address: string, index: number): string => {
    const sha256 = CryptoJS.algo.SHA256.create();
    hash(sha256, bs58.decode(address));
    hash(sha256, `stake:${index}`);
    hash(sha256, bs58.decode(stakeProgramId));
    const pub = Buffer.from(sha256.finalize().toString(), 'hex');
    return bs58.encode(pub);
};

export const selectStakeAccounts = (
    baseAddress: string,
    accounts: {
        [key: string]: IStakeAccountFormat;
    },
    action: PosBasicActionType,
    amount: string,
    validatorId?: string
): { [key: string]: { amount?: string; shouldCreate?: boolean } } => {
    const selectedStakeAccounts = {};
    let amountForAction: BigNumber = new BigNumber(amount);

    if (PosBasicActionType.DELEGATE) {
        Object.keys(accounts).map(address => {
            if (amountForAction.isGreaterThan(0)) {
                const object = accounts[address];
                if (object.unstaked && new BigNumber(object.unstaked).isGreaterThan(0)) {
                    if (new BigNumber(amountForAction).isGreaterThanOrEqualTo(object.unstaked)) {
                        selectedStakeAccounts[address] = {
                            amount: object.unstaked
                        };
                        amountForAction = amountForAction.minus(object.unstaked);
                    } else {
                        // split
                    }
                }
            }
        });
        if (amountForAction.isGreaterThan(0)) {
            const newIndex = Object.keys(accounts).length;
            const newStakeAccountAddress = generateStakeAccount(baseAddress, newIndex);
            selectedStakeAccounts[newStakeAccountAddress] = {
                amount: amountForAction,
                shouldCreate: true
            };
        }
    }

    return selectedStakeAccounts;
};
