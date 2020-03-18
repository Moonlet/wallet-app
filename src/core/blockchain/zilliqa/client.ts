import {
    BlockchainGenericClient,
    IFeeOptions,
    ChainIdType,
    IBlockInfo,
    TransactionMessageText,
    IBlockchainTransaction,
    Blockchain,
    TransactionType
} from '../types';
import { BigNumber } from 'bignumber.js';
import { networks } from './networks';
import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { config } from './config';
import { NameService } from './name-service';
import { TokenType } from '../types/token';
import { Zrc2Client } from './tokens/zrc2-client';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { getAddressFromPublicKey } from '@zilliqa-js/crypto/dist/util';
import { TransactionStatus } from '../../wallet/types';

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);

        this.nameService = new NameService();
        this.tokens[TokenType.ZRC2] = new Zrc2Client(this);
    }

    public async getBalance(address: string): Promise<BigNumber> {
        try {
            const response = await this.call('GetBalance', [
                fromBech32Address(address)
                    .replace('0x', '')
                    .toLowerCase()
            ]);
            return new BigNumber(response.result.balance);
        } catch (result) {
            if (result?.error?.message === 'Account is not created') {
                return Promise.resolve(new BigNumber(0));
            }
            return Promise.reject(result);
        }
    }

    public async getNonce(address: string): Promise<number> {
        try {
            const response = await this.call('GetBalance', [
                fromBech32Address(address)
                    .replace('0x', '')
                    .toLowerCase()
            ]);
            return response.result.nonce + 1; // TODO to see what happens when there are multiple transactions in a limited time
        } catch (result) {
            if (result?.error?.message === 'Account is not created') {
                return 0;
            }
            return Promise.reject(result);
        }
    }

    public async getCurrentBlock(): Promise<IBlockInfo> {
        try {
            const response = await this.call('GetLatestTxBlock');
            return {
                hash: response?.result?.body?.BlockHash,
                number: response?.result?.header?.BlockNum
            };
        } catch (result) {
            return Promise.reject(result);
        }
    }

    public sendTransaction(transaction): Promise<string> {
        return this.http.jsonRpc('CreateTransaction', [transaction]).then(res => {
            if (res.result) {
                return res.result.TranID;
            }

            const errorMessage: string = res.error.message;
            if (errorMessage.includes('transaction underpriced')) {
                return Promise.reject(TransactionMessageText.TR_UNDERPRICED);
            }
        });
    }

    public async call(method: string, params: any[] = []): Promise<any> {
        try {
            const result = await this.http.jsonRpc(method, params);
            if (result.error) {
                return Promise.reject(result);
            }
            return result;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    public async calculateFees(from: string, to: string, tokenType: TokenType) {
        const result = await this.estimateFees();

        const gasPrice = result.result
            ? new BigNumber(Number(result.result))
            : config.feeOptions.defaults.gasPrice;
        const gasLimit = config.feeOptions.defaults.gasLimit[tokenType];

        const feeOptions: IFeeOptions = {
            gasPrice: gasPrice.toString(),
            gasLimit: gasLimit.toString(),
            feeTotal: gasPrice.multipliedBy(gasLimit).toString()
        };

        return feeOptions;
    }

    public async getSmartContractSubState(
        contractAddress: string,
        field: string,
        subFields: string[] = []
    ) {
        return this.call('GetSmartContractSubState', [
            fromBech32Address(contractAddress)
                .replace('0x', '')
                .toLowerCase(),
            field,
            subFields
        ]).then(response => response?.result);
    }

    public async getSmartContractInit(address: string) {
        let addr: string;

        if (isBech32(address)) {
            addr = fromBech32Address(address)
                .replace('0x', '')
                .toLowerCase();
        } else {
            addr = address.replace('0x', '').toLowerCase();
        }

        return this.call('GetSmartContractInit', [addr]).then(response => response?.result);
    }

    public async getTransactionInfo(transactionHash): Promise<IBlockchainTransaction<any>> {
        try {
            const txData = await this.http
                .jsonRpc('GetTransaction', [transactionHash])
                .then(response => {
                    if (!response.result) {
                        throw new Error(
                            response.error.message ||
                                `Error getting transaction info for ${transactionHash}`
                        );
                    }
                    return response.result;
                });

            const toAddress = !isBech32(txData.toAddr)
                ? toBech32Address(txData.toAddr)
                : txData.toAddr;
            let fromAddress = getAddressFromPublicKey(txData.senderPubKey);

            if (!isBech32(fromAddress)) {
                fromAddress = toBech32Address(fromAddress);
            }

            const txStatus = txData.receipt
                ? txData.receipt.success
                    ? TransactionStatus.SUCCESS
                    : TransactionStatus.FAILED
                : TransactionStatus.PENDING;

            return {
                id: txData.ID,
                date: {
                    created: Date.now(),
                    signed: Date.now(),
                    broadcasted: Date.now(),
                    confirmed: Date.now()
                },
                blockchain: Blockchain.ZILLIQA,
                chainId: this.chainId,
                type: TransactionType.TRANSFER,

                address: fromAddress,
                publicKey: txData.senderPubKey,

                toAddress,
                amount: txData.amount,
                feeOptions: {
                    gasPrice: txData.gasPrice,
                    gasLimit: txData.gasLimit,
                    feeTotal: txData.receipt?.cumulative_gas
                },
                broadcatedOnBlock: txData.receipt?.epoch_num,
                nonce: txData.nonce,
                status: txStatus
            };
        } catch (error) {
            return Promise.reject(error.message);
        }
    }

    private async estimateFees(): Promise<any> {
        return this.http.jsonRpc('GetMinimumGasPrice', []);
    }
}
