import BigNumber from 'bignumber.js';
import { getTokenConfig } from '../../redux/tokens/static-selectors';
import { getBlockchain } from '../blockchain/blockchain-factory';
import { Blockchain } from '../blockchain/types';
import { IStatValue, IStatValueType } from '../blockchain/types/stats';
import { formatNumber } from './format-number';

export const statGetValueString = (stat: IStatValue) => {
    switch (stat.type) {
        case IStatValueType.STRING:
            return stat.data.value;
        case IStatValueType.AMOUNT: {
            const tokenConfig = getTokenConfig(
                stat.data.blockchain as Blockchain,
                stat.data.tokenSymbol
            );
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
