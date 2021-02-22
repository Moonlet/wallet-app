import { getTokenConfig } from '../../redux/tokens/static-selectors';
import BigNumber from 'bignumber.js';
import { PosBasicActionType, TokenType } from '../blockchain/types/token';
import { getBlockchain } from '../blockchain/blockchain-factory';
import { AccountType, IAccountState, ITokenState } from '../../redux/wallets/state';
import { Blockchain, ChainIdType, IFeeOptions } from '../blockchain/types';

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
    feeOptions: IFeeOptions,
    balanceAvailable?: string
): { insufficientFunds: boolean; insufficientFundsFees: boolean } => {
    const tokenConfig = getTokenConfig(account.blockchain, token.symbol);

    const result = {
        insufficientFunds: false,
        insufficientFundsFees: false
    };

    // Amount check
    const inputAmount = getInputAmountToStd(account, token, amount);
    const availableBalanceValue = balanceAvailable
        ? getInputAmountToStd(account, token, balanceAvailable)
        : new BigNumber(token.balance?.value);

    // Amount > available amount
    result.insufficientFunds =
        inputAmount.isGreaterThan(availableBalanceValue) ||
        availableBalanceValue.isEqualTo(new BigNumber(0));

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

export const minBalanceNear = async (address: string, chainId: ChainIdType): Promise<BigNumber> => {
    const blockchainInstance = getBlockchain(Blockchain.NEAR);
    const client = blockchainInstance.getClient(chainId);

    const viewAccountRes = await client.http.jsonRpc('query', {
        request_type: 'view_account',
        finality: 'final',
        account_id: address
    });
    return new BigNumber(viewAccountRes?.result?.storage_usage || 500)
        .dividedBy(new BigNumber('10000')) // min balance = storage_used / 10^4
        .plus(new BigNumber(0.1)); // keep 2 NEAR in account
};

export const availableAmount = async (
    account: IAccountState,
    token: ITokenState,
    chainId: ChainIdType,
    options: { feeOptions?: IFeeOptions; balanceAvailable?: string; posAction?: PosBasicActionType }
): Promise<string> => {
    const tokenConfig = getTokenConfig(account.blockchain, token.symbol);

    let balance: BigNumber = options.balanceAvailable
        ? getInputAmountToStd(account, token, options.balanceAvailable)
        : new BigNumber(token.balance?.value);

    const blockchainInstance = getBlockchain(account.blockchain);

    // TODO: find a better place to handle this
    if (account.blockchain === Blockchain.NEAR && account.type === AccountType.DEFAULT) {
        let minBalance;

        if (options.posAction) {
            switch (options.posAction) {
                case PosBasicActionType.UNSTAKE:
                case PosBasicActionType.WITHDRAW:
                    minBalance = new BigNumber(0);
                    break;
                default:
                    minBalance = await minBalanceNear(account.address, chainId);
            }
        } else {
            minBalance = await minBalanceNear(account.address, chainId);
        }

        const amountToStd = blockchainInstance.account.amountToStd(
            minBalance,
            tokenConfig.decimals
        );

        balance = balance.minus(amountToStd);
    } else {
        if (options.feeOptions && tokenConfig.type === TokenType.NATIVE) {
            balance = balance.minus(options.feeOptions?.feeTotal);
        }
    }

    if (balance.isGreaterThanOrEqualTo(0)) {
        const amountFromStd = blockchainInstance.account.amountFromStd(
            balance,
            tokenConfig.decimals
        );
        return amountFromStd.toFixed();
    } else {
        return new BigNumber(0).toString();
    }
};
