import { IClientUtils } from '../types/client-utils';
import { Client } from './client';
import { IBlockchainTransaction, Blockchain, TransactionType } from '../types';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { TokenType, TokenScreenComponentType, PosBasicActionType } from '../types/token';
import { config, Contracts } from './config';
import abi from 'ethereumjs-abi';
import { Celo } from '.';
import { IAccountState } from '../../../redux/wallets/state';
import { IPosWidget } from '../types/stats';
import BigNumber from 'bignumber.js';

export class ClientUtils implements IClientUtils {
    constructor(private client: Client) {}

    async getWidgets(account: IAccountState): Promise<IPosWidget[]> {
        const widgets: IPosWidget[] = [];

        // TODO - call api for after is completed

        const nonVotingAmount: BigNumber = await this.client.contracts[
            Contracts.LOCKED_GOLD
        ].getAccountNonvotingLockedGold(account.address);

        if (nonVotingAmount.isGreaterThan(new BigNumber(0))) {
            const widget: IPosWidget = {
                type: PosBasicActionType.ACTIVATE,
                value: nonVotingAmount.toString(),
                timestamp: '1592652996' // TODO - get time until next epoch
            };
            widgets.push(widget);
        }

        const pendingWithdrawals = await this.client.contracts[
            Contracts.LOCKED_GOLD
        ].getPendingWithdrawals(account.address);

        pendingWithdrawals.map(async (pendingWithdrawal, index) => {
            const widget: IPosWidget = {
                type: PosBasicActionType.WITHDRAW,
                value: pendingWithdrawal.value.toString(),
                timestamp: pendingWithdrawal.time
            };
            widgets.push(widget);
        });

        return widgets;
    }

    async getTransaction(hash: string): Promise<IBlockchainTransaction> {
        const rpcCalls = [
            this.client.http.jsonRpc('eth_getTransactionByHash', [hash]),
            this.client.http.jsonRpc('eth_getTransactionReceipt', [hash])
        ];

        const res = await Promise.all(rpcCalls);

        if (!res[0].result) {
            throw new Error(res[0].error.message || `Error getting transaction info for ${hash}`);
        }
        if (!res[1].result) {
            throw new Error(`Error getting transaction receipt for ${hash}`);
        }
        return this.buildTransactionFromBlockchain(res[0].result, res[1].result);
    }

    async buildTransactionFromBlockchain(txInfo, txReceipt) {
        const token = await this.getToken(txInfo.to);
        const data: any = {};

        // TODO - find how to get the data since its a contract call not simple transfer call
        // if (token.type === TokenType.ERC20) {
        //     try {
        //         const transferInputParameteres = this.decodeInputData(
        //             'transfer(address,uint256)',
        //             txInfo.input
        //         );
        //         if (transferInputParameteres[0] && transferInputParameteres[1]) {
        //             data.params = [
        //                 '0x' + transferInputParameteres[0],
        //                 transferInputParameteres[1].toString(10)
        //             ];
        //         } else {
        //             throw new Error('Cannot decode input data');
        //         }
        //     } catch (e) {
        //         // probably not a transaction
        //         return null;
        //     }
        // }

        return {
            id: txInfo.hash,
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: Blockchain.CELO,
            chainId: this.client.chainId,
            type: TransactionType.TRANSFER,

            address: txInfo.from,
            publicKey: '', // TODO: get publicKey form vrs

            toAddress: txInfo.to,
            amount: txInfo.value,
            data,
            feeOptions: {
                gasPrice: txInfo.gasPrice,
                gasLimit: txInfo.gas,
                feeTotal: txReceipt.gasUsed
            },
            broadcastedOnBlock: txInfo.blockNumber,
            nonce: txInfo.nonce,
            status: Celo.transaction.getTransactionStatusByCode(txReceipt.status),
            token
        };
    }

    async getToken(toAddress: string): Promise<ITokenConfigState> {
        const token = await this.client.tokens[TokenType.ERC20].getTokenInfo(toAddress).catch(e => {
            // not a contract
            return null;
        });

        if (!(token && token.name && token.symbol)) {
            return config.tokens.cGLD;
        }

        token.type = TokenType.ERC20;
        token.ui = {
            decimals: token.decimals,
            tokenScreenComponent: TokenScreenComponentType.DEFAULT
        };

        return token;
    }

    decodeInputData(signature: string, data: string) {
        const sig = signature.split(':');
        const sigParts = sig[0].split('(');
        const methodName = sigParts[0];
        let params = [];
        if (sigParts[1]) {
            params = sigParts[1]
                .replace(')', '')
                .split(',')
                .map(p => p.trim());
        }

        const methodId = abi.methodID(methodName, params).toString('hex');

        data = data.replace('0x', '');

        if (data.indexOf(methodId) === 0) {
            const rawParamsData = data.substr(methodId.length);
            return abi.rawDecode(params, Buffer.from(rawParamsData, 'hex'));
        } else {
            throw new Error('Cannot decode data');
        }
    }
}
