import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { formatNumber } from '../../../../core/utils/format-number';
import { getChainId } from '../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../redux/state';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { getSelectedAccount } from '../../../../redux/wallets/selectors';
import { IScreenModule } from './../../types';

export const getStakeEnterAllBalance = (
    state: IReduxState,
    module: IScreenModule,
    options: { screenKey: string }
) => {
    const account = getSelectedAccount(state);
    const blockchain = account.blockchain;
    const blockchainInstance = getBlockchain(blockchain);
    const chainId = getChainId(state, blockchain);
    const token = account.tokens[chainId][blockchainInstance.config.coin];

    const balance =
        (options.screenKey &&
            state.ui.screens.inputData &&
            state.ui.screens.inputData[options.screenKey]?.data?.amount) ||
        '0';

    const tokenConfig = getTokenConfig(blockchain, token.symbol);

    const amountFromStd = blockchainInstance.account.amountFromStd(
        new BigNumber(balance),
        tokenConfig.decimals
    );

    return formatNumber(amountFromStd, {
        currency: tokenConfig.symbol
    });
};
