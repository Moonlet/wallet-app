import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../../../../core/blockchain/blockchain-factory';
import {
    Blockchain,
    Contracts,
    IBlockchainTransaction,
    IFeeOptions,
    TransactionType
} from '../../../../../../core/blockchain/types';
import { TransactionStatus } from '../../../../../../core/wallet/types';
import { getChainId } from '../../../../../preferences/selectors';
import { IReduxState } from '../../../../../state';
import { getSelectedAccount } from '../../../../../wallets/selectors';
import { getTokenConfig } from '../../../../../tokens/static-selectors';
import { IContractCallParams } from '.';
import {
    ContractMethod,
    PosBasicActionType,
    TokenType
} from '../../../../../../core/blockchain/types/token';
import abi from 'ethereumjs-abi';
import { SolanaTransactionInstructionType } from '../../../../../../core/blockchain/solana/types';

const contractCallFunctionsWhitelist = {
    [Blockchain.ZILLIQA]: [
        ContractMethod.INCREASE_ALLOWANCE,
        ContractMethod.SWAP_EXACT_ZIL_FOR_TOKENS,
        ContractMethod.SWAP_EXACT_TOKENS_FOR_ZIL,
        ContractMethod.SWAP_EXACT_TOKENS_FOR_TOKENS
    ],
    [Blockchain.ETHEREUM]: [ContractMethod.INCREASE_ALLOWANCE, ContractMethod.DELEGATE],
    [Blockchain.SOLANA]: [ContractMethod.SOLANA_CREATE_ASSOCIATED_TOKEN_ACCOUNT]
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
        } else {
            contractAddress = await blockchainInstance.getContract(chainId, params.contractType);
        }

        const tokenConfig = getTokenConfig(account.blockchain, params.tokenSymbol);
        const client = blockchainInstance.getClient(chainId);
        const blockInfo = await client.getCurrentBlock();

        const nonce = await client.getNonce(account.address, account.publicKey);

        const dataParams = [];

        for (const arg of params.args) {
            if (arg.type === 'string') {
                dataParams.push(arg.data.value);
            } else if (arg.data.type === 'value') {
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

        let raw = '';

        switch (account.blockchain) {
            case Blockchain.ZILLIQA:
                raw = JSON.stringify({
                    _tag: params.contractMethod,
                    params: dataParams
                });
                break;

            case Blockchain.ETHEREUM:
                raw =
                    '0x' +
                    abi
                        .simpleEncode(params.additionalInfo.contractMethodSignature, ...dataParams)
                        .toString('hex');
                break;

            case Blockchain.SOLANA: {
                switch (params.additionalInfo.posAction) {
                    case PosBasicActionType.SOLANA_CREATE_ASSOCIATED_TOKEN_ACCOUNT:
                        const blockHash = await client.getCurrentBlockHash();

                        params.additionalInfo = {
                            type: SolanaTransactionInstructionType.CREATE_ASSOCIATED_TOKEN_ACCOUNT,
                            instructions: params.additionalInfo.instructions,
                            currentBlockHash: blockHash,
                            posAction: PosBasicActionType.SOLANA_CREATE_ASSOCIATED_TOKEN_ACCOUNT
                        };
                        break;
                }

                break;
            }
        }

        let feeOptions: IFeeOptions;
        let fetchFeesBackup = false;

        if (params?.fees) {
            // Fees already calculated on api
            if (params?.fees?.gasPrice && params?.fees?.total) {
                feeOptions = {
                    gasPrice: params.fees.gasPrice,
                    gasLimit: params.fees.gasLimit,
                    feeTotal: params.fees.total
                };
            } else {
                // Calculate fees
                const gasLimit = new BigNumber(params.fees.gasLimit);
                const minGasPrice = await client.getMinimumGasPrice();

                if (minGasPrice) {
                    const gasPrice = new BigNumber(minGasPrice);
                    feeOptions = {
                        gasPrice: gasPrice.toFixed(),
                        gasLimit: gasLimit.toFixed(),
                        feeTotal: gasPrice.multipliedBy(gasLimit).toFixed()
                    };
                } else {
                    fetchFeesBackup = true;
                }
            }
        } else {
            fetchFeesBackup = true;
        }

        if (fetchFeesBackup === true) {
            try {
                let tokenType: TokenType;

                switch (account.blockchain) {
                    case Blockchain.ZILLIQA:
                        tokenType = TokenType.ZRC2;
                        break;

                    case Blockchain.SOLANA:
                        tokenType = TokenType.SPL;
                        break;

                    default:
                        tokenType = TokenType.ERC20;
                        break;
                }

                feeOptions = await client.getFees(
                    TransactionType.CONTRACT_CALL,
                    {
                        from: account.address,
                        to: '',
                        amount: params.amount,
                        contractAddress,
                        raw
                    },
                    tokenType
                );
            } catch (error) {
                //
            }
        }

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
            toAddress: contractAddress || '',
            amount: params.amount,
            feeOptions,
            broadcastedOnBlock: blockInfo.number,
            nonce: nonce + currentTransactions.length,
            status: TransactionStatus.PENDING,
            data: {
                method: params.contractMethod,
                params: [contractAddress, params.additionalInfo?.tokenAmount || params.amount],
                raw
            },
            additionalInfo: params.additionalInfo
        };
    }

    return undefined;
};
