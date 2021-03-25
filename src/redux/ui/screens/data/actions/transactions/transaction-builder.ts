import { getBlockchain } from '../../../../../../core/blockchain/blockchain-factory';
import {
    Blockchain,
    IBlockchainTransaction,
    TransactionType
} from '../../../../../../core/blockchain/types';
import { TransactionStatus } from '../../../../../../core/wallet/types';
import { getChainId } from '../../../../../preferences/selectors';
import { IReduxState } from '../../../../../state';
import { getSelectedAccount } from '../../../../../wallets/selectors';
import { getContract } from '../../../../../../core/blockchain/zilliqa/contracts/base-contract';
import { getTokenConfig } from '../../../../../tokens/static-selectors';
import { IContractCallParams } from '.';

const contractCallFunctionsWhitelist = {
    Zilliqa: ['SwapZILForExactTokens', 'SwapZILForExactTokens']
};

const isWhitelistedMethod = (blockchain: Blockchain, method: string): boolean => {
    return contractCallFunctionsWhitelist[blockchain].includes(method);
};

export const buildContractCallTransaction = async (
    getState: () => IReduxState,
    params: IContractCallParams,
    currentTransactions: IBlockchainTransaction[]
): Promise<IBlockchainTransaction<any>> => {
    const state = getState();
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const blockchainInstance = getBlockchain(account.blockchain);

    if (isWhitelistedMethod(account.blockchain, params.contractMethod)) {
        const contractAddress = await getContract(chainId, params.contractType);
        const tokenConfig = getTokenConfig(account.blockchain, params.tokenSymbol);
        const client = blockchainInstance.getClient(chainId);

        const nonce = await client.getNonce(account.address, account.publicKey);

        const raw = JSON.stringify({
            _tag: params.contractMethod, // 'SwapExactTokensForZIL',
            params: params.rawData
        });

        // [
        //     {
        //         vname: 'token_address',
        //         type: 'ByStr20',
        //         value: param.fromToken
        //     },
        //     {
        //         vname: 'min_zil_amount',
        //         type: 'Uint128',
        //         value: param.toTokenAmount
        //     },
        //     {
        //         vname: 'recipient_address',
        //         type: 'ByStr20',
        //         value: param.toToken
        //     },
        //     {
        //         vname: 'token_amount',
        //         type: 'Uint128',
        //         value: param.fromTokenAmount
        //     },
        //     {
        //         vname: 'deadline_block',
        //         type: 'Uint128',
        //         value: param.blockNumber + 100 // expire after 100 blocks
        //     }
        // ]

        const feeOptions = await client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: account.address,
                to: '',
                amount: params.amount,
                contractAddress,
                raw
            },
            tokenConfig.type
        );

        return {
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: account.blockchain,
            chainId,
            type: TransactionType.CONTRACT_CALL,
            token: tokenConfig,
            address: account.address,
            publicKey: account.publicKey,
            toAddress: contractAddress,
            amount: params.amount,
            feeOptions,
            broadcastedOnBlock: params.blockNumber,
            nonce: nonce + currentTransactions.length,
            status: TransactionStatus.PENDING,
            data: {
                method: params.contractType + ' ' + tokenConfig.symbol, // TODO change to somehting relevant
                params: [contractAddress, params.amount],
                raw
            },
            additionalInfo: {}
        };
    }

    return undefined;
};
