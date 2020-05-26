import { getTokenConfig } from '../../redux/tokens/static-selectors';
import BigNumber from 'bignumber.js';
import { TokenType } from '../blockchain/types/token';
import { getBlockchain } from '../blockchain/blockchain-factory';
import { IAccountState, ITokenState } from '../../redux/wallets/state';
import { ChainIdType, IFeeOptions } from '../blockchain/types';

export const getInputAmountToStd = (
    account: IAccountState,
    token: ITokenState,
    amount: string
): BigNumber => {
    const blockchainInstance = getBlockchain(account.blockchain);
    const tokenConfig = getTokenConfig(account.blockchain, token.symbol);

    return blockchainInstance.account.amountToStd(new BigNumber(amount || 0), tokenConfig.decimals);
};

export const availableFunds = (
    amount: string,
    account: IAccountState,
    token: ITokenState,
    chainId: ChainIdType,
    feeOptions: IFeeOptions
): { insufficientFunds: boolean; insufficientFundsFees: boolean } => {
    const tokenConfig = getTokenConfig(account.blockchain, token.symbol);

    const result = {
        insufficientFunds: false,
        insufficientFundsFees: false
    };

    // Amount check
    const inputAmount = getInputAmountToStd(account, token, amount);
    const availableBalanceValue = new BigNumber(token.balance?.value);

    // Amount > available amount
    result.insufficientFunds = inputAmount.isGreaterThan(availableBalanceValue);

    if (result.insufficientFunds === true) {
        return result;
    }

    // Fees check
    const feeTotal = new BigNumber(feeOptions?.feeTotal);

    if (tokenConfig.type === TokenType.NATIVE) {
        // feeTotal + amount > available amount
        result.insufficientFundsFees = feeTotal
            .plus(inputAmount)
            .isGreaterThan(availableBalanceValue);
    } else {
        const nativeCoin = getBlockchain(account.blockchain).config.coin;
        const nativeCoinBalance = account.tokens[chainId][nativeCoin].balance?.value;
        const availableBalance = new BigNumber(nativeCoinBalance);

        // ERC20 / ZRC2
        // feeTotal > available amount
        result.insufficientFundsFees = feeTotal.isGreaterThan(availableBalance);
    }

    return result;
};

export const availableAmount = (
    account: IAccountState,
    token: ITokenState,
    feeOptions?: IFeeOptions
): string => {
    const tokenConfig = getTokenConfig(account.blockchain, token.symbol);

    let balance: BigNumber = new BigNumber(token.balance?.value);
    if (feeOptions) {
        if (tokenConfig.type === TokenType.NATIVE) {
            balance = balance.minus(feeOptions?.feeTotal);
        }
    }

    if (balance.isGreaterThanOrEqualTo(0)) {
        const blockchainInstance = getBlockchain(account.blockchain);
        const amountFromStd = blockchainInstance.account.amountFromStd(
            new BigNumber(balance),
            tokenConfig.decimals
        );
        return amountFromStd.toString();
    } else {
        return new BigNumber(0).toString();
    }
};
