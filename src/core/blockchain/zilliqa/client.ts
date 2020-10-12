import {
    Blockchain,
    BlockchainGenericClient,
    ChainIdType,
    IBlockInfo,
    TransactionMessageText,
    TransactionType,
    IBalance
} from '../types';
import { BigNumber } from 'bignumber.js';
import { networks } from './networks';
import { fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { config, Contracts } from './config';
import { NameService } from './name-service';
import { PosBasicActionType, TokenType } from '../types/token';
import { Zrc2Client } from './tokens/zrc2-client';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { ClientUtils } from './client-utils';
import { Staking } from './contracts/staking';
import { ApiClient } from '../../utils/api-client/api-client';
import { translate } from '../../i18n';
import { Capitalize } from '../../utils/format-string';
import { IAccountState } from '../../../redux/wallets/state';

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);
        this.nameService = new NameService(this);
        this.tokens[TokenType.ZRC2] = new Zrc2Client(this);
        this.utils = new ClientUtils(this);
        this.contracts[Contracts.STAKING] = new Staking(this);
    }

    public async fetchRewardsForTransaction(
        txHash: string
    ): Promise<{ gZil: string; zil: string }> {
        // try {
        //     // let zil = 0;
        //     // this.call('GetTransaction', [txHash]).then(response => {
        //     //     if (response?.result?.receipt?.event_logs) {
        //     //         const logs = response?.result?.receipt?.event_logs;
        //     //         console.log('logs', logs);
        //     //         const zilObject = logs.filter(v => (v._eventname = 'Send deleg rewards'));
        //     //         if (zilObject.length){
        //     //             const params = zilObject.filter(v => (v.vname = 'amt'));
        //     //             if (params.length)
        //     //         }
        //     //     }
        //     // });
        // } catch (e) {}

        return { gZil: '1231234243', zil: '10000' };
    }

    public async getBalance(address: string): Promise<IBalance> {
        try {
            // const x = await this.fetchRewardsForTransaction(
            //     '49dc1686385db6a96e8a5f9c3f6b48fbd0aeeba1a5eb36972da927aa0f6feb2c'
            // );

            const data = await new ApiClient().validators.getBalance(
                address,
                Blockchain.ZILLIQA,
                this.chainId.toString()
            );
            return {
                total: data?.balance.total || new BigNumber(0),
                available: data?.balance.available || new BigNumber(0)
            };
        } catch {
            return { total: new BigNumber(0), available: new BigNumber(0) };
        }
    }

    public async getNonce(address: string, publicKey: string): Promise<number> {
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

    public async canPerformAction(
        action: PosBasicActionType,
        options: {
            account: IAccountState;
            validatorAddress: string[];
        }
    ): Promise<{ value: boolean; message: string }> {
        switch (action) {
            case PosBasicActionType.UNSTAKE:
            case PosBasicActionType.REDELEGATE:
                const canUnstake = await this.contracts[Contracts.STAKING].canUnstakeFromSsn(
                    options.account.address,
                    options.validatorAddress[0]
                );
                if (canUnstake === false)
                    return Promise.resolve({
                        value: false,
                        message: translate('Validator.operationNotAvailableMessage', {
                            operation: Capitalize(action.toLowerCase())
                        })
                    });
                else
                    return Promise.resolve({
                        value: true,
                        message: ''
                    });

            default:
                return Promise.resolve({ value: true, message: '' });
        }
    }

    public sendTransaction(transaction): Promise<string> {
        // return Promise.resolve(`${Math.random()}`); // hack to simulate transactions with success
        // return Promise.reject(); // hack to simulate transactions with fail
        return this.http.jsonRpc('CreateTransaction', [transaction]).then(res => {
            if (res.result) {
                return res.result.TranID;
            }

            const errorMessage: string = res.error.message;
            if (errorMessage.includes('transaction underpriced')) {
                return Promise.reject(TransactionMessageText.TR_UNDERPRICED);
            }
            if (errorMessage.includes("Contract account won't accept normal txn")) {
                return Promise.reject(TransactionMessageText.CONTRACT_TX_NORMAL_NOT_ALLOWED);
            }
            if (errorMessage.includes('Insufficient funds in source account!')) {
                return Promise.reject(TransactionMessageText.INSUFFICIENT_FUNDS_SOURCE_ACCOUNT);
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

    public async getFees(
        transactionType: TransactionType,
        data: {
            from?: string;
            to?: string;
            amount?: string;
            contractAddress?: string;
            raw?: string;
        },
        tokenType: TokenType = TokenType.NATIVE
    ) {
        const gasLimit = config.feeOptions.defaults.gasLimit[tokenType];

        try {
            const result = await this.estimateFees();

            const gasPrice = result.result
                ? new BigNumber(Number(result.result))
                : config.feeOptions.defaults.gasPrice;

            return {
                gasPrice: gasPrice.toString(),
                gasLimit: gasLimit.toString(),
                feeTotal: gasPrice.multipliedBy(gasLimit).toString()
            };
        } catch {
            const gasPrice = config.feeOptions.defaults.gasPrice;
            return {
                gasPrice: gasPrice.toString(),
                gasLimit: gasLimit.toString(),
                feeTotal: gasPrice.multipliedBy(gasLimit).toString()
            };
        }
    }

    public async getSmartContractSubState(
        contractAddress: string,
        field: string,
        subFields: string[] = []
    ) {
        const address = isBech32(contractAddress)
            ? fromBech32Address(contractAddress)
            : contractAddress;
        return this.call('GetSmartContractSubState', [
            address.replace('0x', '').toLowerCase(),
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

    private async estimateFees(): Promise<any> {
        return this.http.jsonRpc('GetMinimumGasPrice', []);
    }

    public async getMinimumAmountDelegate(): Promise<BigNumber> {
        return this.contracts[Contracts.STAKING].getMinDelegateStake();
    }
}
