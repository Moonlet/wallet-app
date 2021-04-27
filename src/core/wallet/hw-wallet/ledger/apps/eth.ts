import EthApp from '@ledgerhq/hw-app-eth';
import { byContractAddress } from '@ledgerhq/hw-app-eth/erc20';
import { IHardwareWalletApp } from '../types';
import { IBlockchainTransaction } from '../../../../blockchain/types';
import { Transaction } from 'ethereumjs-tx';
import BigNumber from 'bignumber.js';
import { TokenType } from '../../../../blockchain/types/token';

export class Eth implements IHardwareWalletApp {
    private app: EthApp;
    constructor(transport) {
        this.app = new EthApp(transport);
    }

    public getPath(index, derivationIndex, path) {
        switch (path) {
            case 'legacy':
                return `44'/60'/${index}'/${derivationIndex}`;
            case 'live':
            default:
                return `44'/60'/${index}'/0/${derivationIndex}`;
        }
    }

    /**
     * @param {number} index index of account
     * @param {number} derivationIndex index of derivation for an account
     * @param {number} path derivation path, values accepted: live, legacy
     */
    public getAddress(index: number, derivationIndex: number = 0, path: string) {
        return this.app.getAddress(this.getPath(index, derivationIndex, path), true, false);
    }

    public signTransaction = async (
        index: number,
        derivationIndex: number = 0,
        path: string,
        tx: IBlockchainTransaction
    ): Promise<any> => {
        const params = {
            nonce: '0x' + tx.nonce.toString(16),
            gasPrice: '0x' + new BigNumber(tx.feeOptions.gasPrice).toString(16),
            gasLimit: '0x' + new BigNumber(tx.feeOptions.gasLimit).toString(16),
            to: tx.toAddress.toLowerCase(),
            value: '0x' + new BigNumber(tx.amount).toString(16)
        };

        let txParams;

        if (tx.data) {
            txParams = {
                ...params,
                data: tx.data?.raw.toLowerCase()
            };

            if (tx.token.type === TokenType.ERC20) {
                const tokenInfo = byContractAddress(tx.toAddress.toLowerCase());

                if (tokenInfo) await this.app.provideERC20TokenInformation(tokenInfo);
            }
        } else txParams = params;

        const transaction = new Transaction(txParams, {
            chain: tx.chainId
        });

        transaction.raw[6] = Buffer.from([Number(tx.chainId)]); // v
        transaction.raw[7] = Buffer.from([]); // r
        transaction.raw[8] = Buffer.from([]); // s

        const result = await this.app.signTransaction(
            this.getPath(index, derivationIndex, path),
            transaction.serialize().toString('hex')
        );

        transaction.v = Buffer.from(result.v, 'hex');
        transaction.r = Buffer.from(result.r, 'hex');
        transaction.s = Buffer.from(result.s, 'hex');
        return '0x' + transaction.serialize().toString('hex');
    };

    public getInfo() {
        return this.app.getAppConfiguration();
    }

    public signMessage = async (
        index: number,
        derivationIndex: number,
        path: string,
        message: string
    ): Promise<any> => {
        throw new Error('signMessage NOT IMPLEMENTED');
    };
}
