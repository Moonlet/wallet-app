import { IAction } from '../types';
import { IWalletState, ITransactionState } from './state';
import { WALLET_ADD, ACCOUNT_GET_BALANCE, TRANSACTION_PUBLISHED } from './actions';

const intialState: IWalletState[] = [];

const newBalance = (oldBalance: any, action: any) => {
    const balance = {
        value: action.data.balance ? action.data.balance : oldBalance?.value,
        inProgress: action.inProgress !== undefined ? oldBalance?.inProgress : action.inProgress,
        timestamp: action.data.balance ? new Date() : oldBalance?.timestamp,
        error: action.error !== undefined ? action.error : undefined
    };

    return balance;
};

export default (state: IWalletState[] = intialState, action: IAction) => {
    switch (action.type) {
        case WALLET_ADD:
            //    return [...state, action.data];
            return [action.data]; // this will reset persisted redux wallets
        case ACCOUNT_GET_BALANCE: {
            return state.map(wallet =>
                wallet.id === action.data.walletId
                    ? {
                          ...wallet,
                          accounts: wallet.accounts.map(account =>
                              account.address === action.data.address &&
                              account.blockchain === action.data.blockchain
                                  ? {
                                        ...account,
                                        balance: newBalance(account.balance, action) // TODO: here ce ai tu nevoie sa setezi
                                    }
                                  : account
                          )
                      }
                    : wallet
            );
        }
        case TRANSACTION_PUBLISHED: {
            const transaction: ITransactionState = {
                id: action.data.hash,
                date: new Date(),
                fromAddress: action.data.tx.from,
                toAddress: action.data.tx.to,
                amount: action.data.tx.amount,
                nonce: action.data.tx.options.nonce,
                block: undefined,
                feeOptions: {
                    gasPrice: action.data.tx.options.gasPrice,
                    gasLimit: action.data.tx.options.gasLimit,
                    usedGas: undefined
                }
            };
            return state.map(wallet =>
                wallet.id === action.data.walletId
                    ? {
                          ...wallet,
                          transactions: {
                              ...wallet.transactions,
                              [action.data.hash]: transaction
                          }
                      }
                    : wallet
            );
        }
        default:
            break;
    }
    return state;
};
