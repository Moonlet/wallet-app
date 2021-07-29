import {
    AbstractBlockchainTransactionUtils,
    Blockchain,
    Contracts,
    IBlockchainTransaction,
    IPosTransaction,
    ITransferTransaction,
    TransactionType
} from '../types';

import { TransactionStatus } from '../../wallet/types';
import { PosBasicActionType, TokenType } from '../types/token';
import { Solana } from '.';
import { Client as SolanaClient } from './client';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { StakeProgram } from '@solana/web3.js/src/stake-program';
import { SystemProgram } from '@solana/web3.js/src/system-program';
import { PublicKey } from '@solana/web3.js/src/publickey';
import { Account } from '@solana/web3.js/src/account';
import { Transaction } from '@solana/web3.js/src/transaction';
import { SolanaTransactionInstructionType } from './types';
import { decode as bs58Decode } from 'bs58';
import { cloneDeep } from 'lodash';
import { config } from '../solana/config';
import { splitStake } from '../../utils/balance';
import BigNumber from 'bignumber.js';
import { selectStakeAccounts } from './contracts/base-contract';
import { getBlockchain } from '../blockchain-factory';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TokenSwap, TOKEN_SWAP_PROGRAM_ID } from '@solana/spl-token-swap';
import { ApiClient } from '../../utils/api-client/api-client';
import { LoadingModal } from '../../../components/loading-modal/loading-modal';
import { TransactionInstruction } from '@solana/web3.js';

export class SolanaTransactionUtils extends AbstractBlockchainTransactionUtils {
    public async sign(tx: IBlockchainTransaction, privateKey: string): Promise<any> {
        const account = new Account(bs58Decode(privateKey));
        const client = Solana.getClient(tx.chainId) as SolanaClient;
        let transaction;

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

            case SolanaTransactionInstructionType.CREATE_ASSOCIATED_TOKEN_ACCOUNT:
                transaction = new Transaction();
                let instructions: any = tx.additionalInfo.instructions;
                instructions = instructions.map(i => new PublicKey(i));
                // @ts-ignore
                transaction.add(Token.createAssociatedTokenAccountInstruction(...instructions));
                break;

            case SolanaTransactionInstructionType.SWAP:
                transaction = new Transaction();

                const baseAccountKey: PublicKey = new PublicKey(
                    '9AVaowib8ePah1VdJft6mgZtYQcHgLA4y1TAEV22Jhan'
                );

                const amountIn = tx.additionalInfo.swap.fromTokenAmount;
                const minimumAmountOut = tx.additionalInfo.swap.toTokenAmount;

                const {
                    // authority,
                    fromAccount,
                    toAccount
                } = tx.additionalInfo.pubkeys;

                const blockchainInstance = getBlockchain(Blockchain.SOLANA);

                const amtIn = Number(
                    blockchainInstance.account.amountToStd(amountIn, 6).toFixed(0)
                );
                const amtOut = Number(
                    blockchainInstance.account.amountToStd(minimumAmountOut, 6).toFixed(0)
                );

                // console.log(amtIn, amtOut);

                const usdc = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
                const srm = new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt');

                // Token: Approve
                transaction.add(
                    Token.createApproveInstruction(
                        TOKEN_PROGRAM_ID,
                        new PublicKey(fromAccount), // account
                        usdc, // delegate
                        baseAccountKey, // owner
                        [], // multiSigners
                        amtIn
                    )
                );

                // Raydium Liquidity Pool Program V4
                // const liquidityPool: PublicKey = new PublicKey(
                //     '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'
                // );

                // Raydium LP Token V4 (SRM-USDC)
                const pool: PublicKey = new PublicKey(
                    '9XnZd82j34KxNLgQfz29jGbYdxsYznTWRpvZE3SRE7JG'
                );

                // const tokenSwapAccount = new PublicKey();
                // const tokenSwapAccount = new Account();

                // Token Swap: Swap
                transaction.add(
                    TokenSwap.swapInstruction(
                        // tokenSwapAccount.publicKey,
                        // new PublicKey(authority),

                        // pool,
                        usdc,
                        baseAccountKey,
                        //

                        baseAccountKey, // userTransferAuthority

                        new PublicKey(fromAccount), // userSource
                        usdc, // poolSource
                        srm, // poolDestination
                        new PublicKey(toAccount), // userDestination User's destination token account

                        pool, // poolToken,

                        baseAccountKey, // feeAccount
                        baseAccountKey, // hostFeeAccount - Host account to gather fees

                        TOKEN_SWAP_PROGRAM_ID,
                        TOKEN_PROGRAM_ID,

                        amtIn, // 100000, //  0.1, // amountIn,
                        amtOut //   90661 // 3 // minimumAmountOut
                    )
                );

                // Token: Revoke
                transaction.add(
                    Token.createRevokeInstruction(
                        TOKEN_PROGRAM_ID,
                        new PublicKey(fromAccount), // account
                        baseAccountKey, // owner
                        []
                    )
                );

                break;
        }

        transaction.recentBlockhash = await client.getCurrentBlockHash();

        transaction.sign(...[account]);

        return transaction.serialize();
    }

    public async buildPosTransaction(
        tx: IPosTransaction,
        transactionType: PosBasicActionType
    ): Promise<IBlockchainTransaction[]> {
        const client = Solana.getClient(tx.chainId);

        const transactions: IBlockchainTransaction[] = [];
        const allStakeAccounts = tx.account.tokens[client.chainId][config.coin].balance?.detailed;
        const usedStakedAccounts: string[] = [];

        switch (transactionType) {
            case PosBasicActionType.DELEGATE:
                const splitAmount = splitStake(new BigNumber(tx.amount), tx.validators.length);

                for (const validator of tx.validators) {
                    const stakeAccounts = selectStakeAccounts(
                        tx.account.address,
                        allStakeAccounts,
                        PosBasicActionType.DELEGATE,
                        splitAmount.toFixed(),
                        usedStakedAccounts
                    );

                    for (const key in stakeAccounts) {
                        if (stakeAccounts[key]) {
                            const stakeAccount = stakeAccounts[key];

                            if (stakeAccount.options?.shouldCreate) {
                                const txCreate: IPosTransaction = cloneDeep(tx);
                                txCreate.extraFields.stakeAccountKey = key;
                                txCreate.extraFields.stakeAccountIndex = stakeAccount.options.index;
                                txCreate.amount = new BigNumber(stakeAccount.amount).toFixed(
                                    0,
                                    BigNumber.ROUND_DOWN
                                );
                                const transactionCreate: IBlockchainTransaction = await client.contracts[
                                    Contracts.STAKING
                                ].createStakeAccountWithSeed(txCreate);
                                transactions.push(transactionCreate);
                            }

                            if (stakeAccount.options?.shouldSplit) {
                                const txSplit: IPosTransaction = cloneDeep(tx);
                                txSplit.amount = new BigNumber(stakeAccount.amount).toFixed(
                                    0,
                                    BigNumber.ROUND_DOWN
                                );
                                txSplit.extraFields.stakeAccountKey =
                                    stakeAccount.options.splitFrom;
                                txSplit.extraFields.stakeAccountIndex = stakeAccount.options.index;
                                const transactionSplit: IBlockchainTransaction = await client.contracts[
                                    Contracts.STAKING
                                ].split(txSplit, key);
                                transactions.push(transactionSplit);
                            }

                            const txStake: IPosTransaction = cloneDeep(tx);
                            txStake.amount = new BigNumber(stakeAccount.amount).toFixed(
                                0,
                                BigNumber.ROUND_DOWN
                            );
                            txStake.extraFields.stakeAccountKey = key;
                            const transaction: IBlockchainTransaction = await client.contracts[
                                Contracts.STAKING
                            ].delegateStake(txStake, validator);
                            transactions.push(transaction);
                            usedStakedAccounts.push(key);
                        }
                    }
                }
                break;
            case PosBasicActionType.UNSTAKE:
                const selectedStakeAccounts = selectStakeAccounts(
                    tx.account.address,
                    allStakeAccounts,
                    PosBasicActionType.UNSTAKE,
                    tx.amount,
                    usedStakedAccounts,
                    tx.validators[0].id
                );

                for (const key in selectedStakeAccounts) {
                    if (selectedStakeAccounts[key]) {
                        const stakeAccount = selectedStakeAccounts[key];

                        if (stakeAccount.options?.shouldSplit) {
                            const txSplit: IPosTransaction = cloneDeep(tx);
                            txSplit.amount = new BigNumber(stakeAccount.amount).toFixed(
                                0,
                                BigNumber.ROUND_DOWN
                            );
                            txSplit.extraFields.stakeAccountKey = stakeAccount.options.splitFrom;
                            txSplit.extraFields.stakeAccountIndex = stakeAccount.options.index;
                            const transactionSplit: IBlockchainTransaction = await client.contracts[
                                Contracts.STAKING
                            ].split(txSplit, key);
                            transactions.push(transactionSplit);
                        }

                        const txUnstake = cloneDeep(tx);
                        txUnstake.amount = new BigNumber(stakeAccount.amount).toFixed(
                            0,
                            BigNumber.ROUND_DOWN
                        );
                        txUnstake.extraFields.stakeAccountKey = key;
                        const transactionUnstake: IBlockchainTransaction = await client.contracts[
                            Contracts.STAKING
                        ].unStake(txUnstake, tx.validators[0]);
                        transactions.push(transactionUnstake);
                        usedStakedAccounts.push(key);
                    }
                }

                break;

            case PosBasicActionType.WITHDRAW:
                const transactionWithdraW: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].withdraw(cloneDeep(tx));

                transactionWithdraW.amount = new BigNumber(tx.extraFields.amount).toFixed(
                    0,
                    BigNumber.ROUND_DOWN
                );
                transactions.push(transactionWithdraW);
                break;

            case PosBasicActionType.SOLANA_STAKEACCOUNT_CREATE: {
                const solanaTxCreate: IPosTransaction = cloneDeep(tx);
                const solanaTransactionCreate: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].createStakeAccountWithSeed(solanaTxCreate);
                transactions.push(solanaTransactionCreate);
                break;
            }

            case PosBasicActionType.SOLANA_STAKEACCOUNT_DELEGATE: {
                const solanaTxStake: IPosTransaction = cloneDeep(tx);
                solanaTxStake.extraFields.amount = new BigNumber(
                    (tx.validators as any)[0].amount
                ).toFixed();
                const solanaTransactionDelegate: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].delegateStake(solanaTxStake, (tx.validators as any)[0].validator);
                transactions.push(solanaTransactionDelegate);
                break;
            }

            case PosBasicActionType.SOLANA_STAKEACCOUNT_SPLIT: {
                const solanaTxSplit: IPosTransaction = cloneDeep(tx);
                solanaTxSplit.amount = new BigNumber(tx.amount).toFixed();
                const solanaTransactionSplit: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].split(solanaTxSplit);

                transactions.push(solanaTransactionSplit);
                break;
            }

            case PosBasicActionType.SOLANA_STAKEACCOUNT_UNSTAKE: {
                const solanaTxUnstake: IPosTransaction = cloneDeep(tx);
                const solanaTransactionUnstake: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].unStake(solanaTxUnstake, tx.validators[0]);
                transactions.push(solanaTransactionUnstake);
                break;
            }

            case PosBasicActionType.SOLANA_STAKEACCOUNT_WITHDRAW: {
                const solanaTxWithdraw: IPosTransaction = cloneDeep(tx);
                const solanaTransactionWithdraw: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].withdraw(solanaTxWithdraw);
                transactions.push(solanaTransactionWithdraw);
                break;
            }

            case PosBasicActionType.SOLANA_CREATE_AND_DELEGATE_STAKE_ACCOUNT: {
                const blockchainInstance = getBlockchain(tx.account.blockchain);
                const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

                const amount = blockchainInstance.account
                    .amountToStd(tx.extraFields.amount, tokenConfig.decimals)
                    .toFixed(0, BigNumber.ROUND_DOWN);

                // Create stake account tx
                const solanaTxCreate: IPosTransaction = cloneDeep(tx);
                solanaTxCreate.amount = amount;
                solanaTxCreate.extraFields.posAction =
                    PosBasicActionType.SOLANA_STAKEACCOUNT_CREATE;
                const solanaTransactionCreate: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].createStakeAccountWithSeed(solanaTxCreate);
                solanaTransactionCreate.amount = amount;
                transactions.push(solanaTransactionCreate);

                // Delegate tx
                const solanaTxStake: IPosTransaction = cloneDeep(tx);
                solanaTxStake.extraFields.amount = amount;
                solanaTxCreate.extraFields.posAction =
                    PosBasicActionType.SOLANA_STAKEACCOUNT_DELEGATE;
                const solanaTransactionDelegate: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].delegateStake(solanaTxStake, (tx.validators as any)[0].validator);
                transactions.push(solanaTransactionDelegate);
                break;
            }
        }

        return transactions;
    }

    public async buildTransferTransaction(
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction> {
        const client = Solana.getClient(tx.chainId) as SolanaClient;

        const tokenInfo = getTokenConfig(tx.account.blockchain, tx.token);
        const blockHash = await client.getCurrentBlockHash();
        const blockInfo = await client.getCurrentBlock();

        switch (tokenInfo.type) {
            case TokenType.SPL: {
                await LoadingModal.open();

                const apiClient = new ApiClient().http;

                let source: string;
                let destination: string;
                let destinationActive: boolean;

                const mint = tokenInfo.contractAddress;

                try {
                    destinationActive = await client.isActiveToken(
                        mint,
                        tx.toAddress,
                        TokenType.SPL
                    );

                    const sourceRes = await apiClient.post(
                        '/blockchain/solana/spl/associatedAddress',
                        {
                            owner: tx.account.address,
                            mint
                        }
                    );
                    source = sourceRes?.result?.data;

                    const destinationRes = await apiClient.post(
                        '/blockchain/solana/spl/associatedAddress',
                        {
                            owner: tx.toAddress,
                            mint
                        }
                    );
                    destination = destinationRes?.result?.data;

                    if (!source || !destination) {
                        await LoadingModal.close();
                        return Promise.reject({ error: 'SPL_INVALID_ADDRESS' });
                    }
                } catch (error) {
                    await LoadingModal.close();
                    throw error;
                }

                await LoadingModal.close();

                const instructions: TransactionInstruction[] = [];

                if (!destinationActive) {
                    // Token not created
                    instructions.push(
                        Token.createAssociatedTokenAccountInstruction(
                            ASSOCIATED_TOKEN_PROGRAM_ID,
                            TOKEN_PROGRAM_ID,
                            new PublicKey(mint),
                            new PublicKey(destination), // associatedAddress
                            new PublicKey(tx.toAddress), // owner
                            new PublicKey(tx.account.address) // payer
                        )
                    );
                }

                instructions.push(
                    // @ts-ignore
                    Token.createTransferCheckedInstruction(
                        TOKEN_PROGRAM_ID,
                        new PublicKey(source), // source
                        new PublicKey(tokenInfo.contractAddress), // mint
                        new PublicKey(destination), // destination
                        new PublicKey(tx.account.address), // owner
                        [], // multiSigners
                        Number(tx.amount), // amount
                        tokenInfo.decimals // decimals
                    )
                );

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
                    token: tokenInfo,

                    address: tx.account.address,
                    publicKey: tx.account.publicKey,

                    toAddress: tx.toAddress,
                    amount: tx.amount,
                    feeOptions: tx.feeOptions,
                    broadcastedOnBlock: blockInfo?.number,
                    nonce: 0, // not used
                    status: TransactionStatus.PENDING,
                    additionalInfo: {
                        currentBlockHash: blockHash,

                        type: SolanaTransactionInstructionType.TRANSFER,
                        instructions
                    }
                };
            }

            default:
                // case TokenType.NATIVE:
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
                    token: tokenInfo,

                    address: tx.account.address,
                    publicKey: tx.account.publicKey,

                    toAddress: tx.toAddress,
                    amount: tx.amount,
                    feeOptions: tx.feeOptions,
                    broadcastedOnBlock: blockInfo?.number,
                    nonce: 0, // not used
                    status: TransactionStatus.PENDING,
                    additionalInfo: {
                        currentBlockHash: blockHash,

                        type: SolanaTransactionInstructionType.TRANSFER,
                        instructions: [
                            SystemProgram.transfer({
                                fromPubkey: new PublicKey(tx.account.address),
                                toPubkey: new PublicKey(tx.toAddress),
                                lamports: tx.amount
                            })
                        ]
                    }
                };
        }
    }

    public getTransactionAmount(tx: IBlockchainTransaction): string {
        const tokenInfo = getTokenConfig(tx.blockchain, tx.token?.symbol);
        if (tokenInfo.type === TokenType.ERC20) {
            return tx?.data?.params[1];
        } else {
            // Amount is stored on data params for stake tx
            if (
                tx?.additionalInfo?.type === SolanaTransactionInstructionType.DELEGATE_STAKE &&
                tx?.data?.params &&
                tx?.data?.params[1]
            ) {
                return tx?.data?.params[1];
            }
            return tx.amount;
        }
    }
}
