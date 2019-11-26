import { BlockchainGenericClient } from '../types';
import { networks } from './networks';
import { BigNumber } from 'bignumber.js';
import { config } from './config';
import { convertUnit } from '../ethereum/account';

export class Client extends BlockchainGenericClient {
    constructor(chainId: number) {
        super(chainId, networks);
    }

    public getBalance(address: string): Promise<BigNumber> {
        return this.rpc.call('eth_getBalance', [this.fixAddress(address), 'latest']).then(res => {
            return new BigNumber(res.result, 16);
        });
    }

    public getNonce(address: string): Promise<number> {
        return this.rpc
            .call('eth_getTransactionCount', [this.fixAddress(address), 'latest'])
            .then(res => {
                return new BigNumber(res.result, 16).toNumber();
            });
    }

    public sendTransaction(transaction): Promise<string> {
        return this.rpc.call('eth_sendRawTransaction', [transaction]).then(res => res.result);
    }

    public async calculateFees(from: string, to: string) {
        const results = await this.estimateFees(from, to);

        let presets: {
            cheap: BigNumber;
            standard: BigNumber;
            fast: BigNumber;
            fastest: BigNumber;
        };
        if (results[1]) {
            const response = await results[1].json();

            presets = {
                cheap: convertUnit(
                    new BigNumber(response.safeLow / 10),
                    config.feeOptions.ui.gasPriceUnit,
                    config.defaultUnit
                ),
                standard: convertUnit(
                    new BigNumber(response.average / 10),
                    config.feeOptions.ui.gasPriceUnit,
                    config.defaultUnit
                ),
                fast: convertUnit(
                    new BigNumber(response.fast / 10),
                    config.feeOptions.ui.gasPriceUnit,
                    config.defaultUnit
                ),
                fastest: convertUnit(
                    new BigNumber(response.fastest / 10),
                    config.feeOptions.ui.gasPriceUnit,
                    config.defaultUnit
                )
            };
        }

        const gasPrice = presets?.standard || config.feeOptions.defaults.gasPrice;
        const gasLimit = results[0].result
            ? new BigNumber(parseInt(results[0].result, 16))
            : config.feeOptions.defaults.gasLimit;

        return {
            gasPrice,
            gasLimit,
            presets: presets ? presets : config.feeOptions.defaults.gasPricePresets,
            feeTotal: gasPrice.multipliedBy(gasLimit)
        };
    }

    private async estimateFees(from: string, to: string): Promise<any> {
        return Promise.all([
            this.rpc.call('eth_estimateGas', [{ from, to }]),
            fetch('https://ethgasstation.info/json/ethgasAPI.json')
        ]);
    }

    private fixAddress(address: string): string {
        if (address.indexOf('0x') < 0) {
            address = '0x' + address;
        }
        return address;
    }
}
