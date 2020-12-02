import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { formatNumber } from '../../../../core/utils/format-number';
import { getChainId } from '../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../redux/state';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { getSelectedAccount } from '../../../../redux/wallets/selectors';
import { IScreenModule } from './../../types';

export const getStakeEnterAllBalanceFormat = (state: IReduxState, module: IScreenModule) => {
    const account = getSelectedAccount(state);
    const blockchain = account.blockchain;
    const blockchainInstance = getBlockchain(blockchain);
    const chainId = getChainId(state, blockchain);
    const token = account.tokens[chainId][blockchainInstance.config.coin];

    let balance = new BigNumber(token.balance?.available || '0');

    if (balance.isGreaterThan(new BigNumber(0))) {
        balance = balance.minus(blockchainInstance.config.amountToKeepInAccount[account.type]);
    }

    const tokenConfig = getTokenConfig(blockchain, token.symbol);

    const amountFromStd = blockchainInstance.account.amountFromStd(balance, tokenConfig.decimals);

    return formatNumber(amountFromStd, {
        currency: tokenConfig.symbol
    });
};

export const getStakeEnterAllBalance = (state: IReduxState, module: IScreenModule) => {
    const account = getSelectedAccount(state);
    const blockchain = account.blockchain;
    const blockchainInstance = getBlockchain(blockchain);
    const chainId = getChainId(state, blockchain);
    const token = account.tokens[chainId][blockchainInstance.config.coin];

    let balance = new BigNumber(token.balance?.available || '0');

    if (balance.isGreaterThan(new BigNumber(0))) {
        balance = balance.minus(blockchainInstance.config.amountToKeepInAccount[account.type]);
    }

    const tokenConfig = getTokenConfig(blockchain, token.symbol);

    return blockchainInstance.account.amountFromStd(balance, tokenConfig.decimals);
};
