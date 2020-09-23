import BigNumber from 'bignumber.js';
import { ITokenConfigState } from '../../redux/tokens/state';
import { IStatValue, IStatValueType } from '../../redux/ui/stats/state';
import { getBlockchain } from '../blockchain/blockchain-factory';
import { Blockchain } from '../blockchain/types';
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

            const amountFromStd = blockchainInstance.account.amountFromStd(
                new BigNumber(stat.data.value),
                tokenConfig.decimals
            );
            return formatNumber(new BigNumber(amountFromStd), {
                currency: blockchainInstance.config.coin,
                maximumFractionDigits: 4
            });
        }
    }
};
