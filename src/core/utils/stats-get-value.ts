import BigNumber from 'bignumber.js';
import { ITokenConfigState } from '../../redux/tokens/state';
import { getBlockchain } from '../blockchain/blockchain-factory';
import { Blockchain } from '../blockchain/types';
import { IStatValue, IStatValueType } from '../blockchain/types/stats';
import { formatNumber } from './format-number';

export const statGetValueString = (stat: IStatValue, tokenConfig: ITokenConfigState) => {
    if (!tokenConfig) {
        return null;
    }

    switch (stat.type) {
        case IStatValueType.STRING:
            return stat.data.value;
        case IStatValueType.AMOUNT: {
            const blockchainInstance = getBlockchain(stat.data.blockchain as Blockchain);

            let amountFromStd = blockchainInstance.account.amountFromStd(
                new BigNumber(stat.data.value),
                tokenConfig.decimals
            );

            // remove decimals if amount is grater than 10 000
            if (new BigNumber(amountFromStd).isGreaterThan(new BigNumber('10000'))) {
                amountFromStd = new BigNumber(amountFromStd.toFixed(0));
            }

            return formatNumber(new BigNumber(amountFromStd), {
                currency: blockchainInstance.config.coin,
                maximumFractionDigits: 4
            });
        }
    }
};
