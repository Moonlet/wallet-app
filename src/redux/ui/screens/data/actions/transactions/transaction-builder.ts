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
import { TokenType } from '../../../../../../core/blockchain/types/token';
import { Contracts } from '../../../../../../core/blockchain/zilliqa/config';

const contractCallFunctionsWhitelist = {
    [Blockchain.ZILLIQA]: ['SwapExactTokensForZIL', 'SwapExactZILForTokens', 'IncreaseAllowance']
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
        let contractAddress: string = '';

        if (params.contractType === Contracts.TOKEN_CONTRACT) {
            const configToken = getTokenConfig(account.blockchain, params.tokenSymbol);
            contractAddress = configToken.contractAddress;
        } else contractAddress = await getContract(chainId, params.contractType);

        const tokenConfig = getTokenConfig(account.blockchain, blockchainInstance.config.coin);
        const client = blockchainInstance.getClient(chainId);
        const blockInfo = await client.getCurrentBlock();

        const nonce = await client.getNonce(account.address, account.publicKey);

        const dataParams = [];

        for (const arg of params.args) {
            if (arg.data.type === 'value') {
                const obj = {
                    type: arg.type,
                    value: arg.data.value
                };
                if (arg.name) {
                    dataParams.push({
                        ...obj,
                        vname: arg.name // TODO key might be needed to be passed from param
                    });
                } else {
                    dataParams.push(obj);
                }
            }
        }

        const raw = JSON.stringify({
            _tag: params.contractMethod,
            params: dataParams
        });

        const feeOptions = await client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: account.address,
                to: '',
                amount: params.amount,
                contractAddress,
                raw
            },
            TokenType.ZRC2 // TODO change this when implementing other blockchains
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
            broadcastedOnBlock: blockInfo.number,
            nonce: nonce + currentTransactions.length,
            status: TransactionStatus.PENDING,
            data: {
                method: params.contractMethod,
                params: [contractAddress, params.amount],
                raw
            },
            additionalInfo: params.aditionalInfo
        };
    }

    return undefined;
};
