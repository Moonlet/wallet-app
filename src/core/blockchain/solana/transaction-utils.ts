import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { LiquidityPoolInfo } from 'raydium-ui/src/utils/pools';
import { u8, nu64, struct } from 'buffer-layout';

export const solanaSwapInstruction = (
    poolInfo: LiquidityPoolInfo,

    // user
    userSourceTokenAccount: PublicKey,
    userDestTokenAccount: PublicKey,
    userOwner: PublicKey,

    amountIn: number,
    minAmountOut: number
): TransactionInstruction => {
    const dataLayout = struct([u8('instruction'), nu64('amountIn'), nu64('minAmountOut')]);

    const keys = [
        // spl token
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: true },
        // amm
        { pubkey: new PublicKey(poolInfo.ammId), isSigner: false, isWritable: true },
        { pubkey: new PublicKey(poolInfo.ammAuthority), isSigner: false, isWritable: true },
        { pubkey: new PublicKey(poolInfo.ammOpenOrders), isSigner: false, isWritable: true },
        { pubkey: new PublicKey(poolInfo.ammTargetOrders), isSigner: false, isWritable: true },
        {
            pubkey: new PublicKey(poolInfo.poolCoinTokenAccount),
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: new PublicKey(poolInfo.poolPcTokenAccount),
            isSigner: false,
            isWritable: true
        },
        // serum
        { pubkey: new PublicKey(poolInfo.serumProgramId), isSigner: false, isWritable: true },
        { pubkey: new PublicKey(poolInfo.serumMarket), isSigner: false, isWritable: true },
        { pubkey: new PublicKey(poolInfo.serumBids), isSigner: false, isWritable: true },
        { pubkey: new PublicKey(poolInfo.serumAsks), isSigner: false, isWritable: true },
        { pubkey: new PublicKey(poolInfo.serumEventQueue), isSigner: false, isWritable: true },
        {
            pubkey: new PublicKey(poolInfo.serumCoinVaultAccount),
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: new PublicKey(poolInfo.serumPcVaultAccount),
            isSigner: false,
            isWritable: true
        },
        { pubkey: new PublicKey(poolInfo.serumVaultSigner), isSigner: false, isWritable: true },
        { pubkey: userSourceTokenAccount, isSigner: false, isWritable: true },
        { pubkey: userDestTokenAccount, isSigner: false, isWritable: true },
        { pubkey: userOwner, isSigner: true, isWritable: true }
    ];

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
        {
            instruction: 9,
            amountIn,
            minAmountOut
        },
        data
    );

    return new TransactionInstruction({
        keys,
        programId: new PublicKey(poolInfo.programId),
        data
    });
};
