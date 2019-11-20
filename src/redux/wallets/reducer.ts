import { IAction } from '../types';
import { IWalletState, ITransactionState, IAccountState } from './state';
import { WALLET_ADD, WALLET_DELETE, ACCOUNT_GET_BALANCE, TRANSACTION_PUBLISHED } from './actions';
import { TransactionStatus } from '../../core/wallet/types';
import { REHYDRATE } from 'redux-persist';
import BigNumber from 'bignumber.js';

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
        case REHYDRATE:
            return action.payload
                ? action.payload.wallets.map((wallet: IWalletState) => ({
                      ...wallet,
                      accounts: wallet.accounts.map((account: IAccountState) => ({
                          ...account,
                          balance: {
                              ...account.balance,
                              value: new BigNumber(account.balance?.value || 0)
                          }
                      })),
                      transactions: Object.values(wallet.transactions).map(
                          (tx: ITransactionState) => ({
                              ...transaction,
                              amount: new BigNumber(tx.amount || 0)
                          })
                      )
                  }))
                : state;
        case WALLET_ADD:
            return [...state, action.data];
        // return [action.data]; // this will reset persisted redux wallets
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
                                        balance: newBalance(account.balance, action)
                                    }
                                  : account
                          )
                      }
                    : wallet
            );
        }
        case TRANSACTION_PUBLISHED:
            const transaction: ITransactionState = {
                id: action.data.hash,
                date: {
                    created: Date.now(),
                    signed: Date.now(),
                    broadcasted: Date.now(),
                    confirmed: Date.now()
                },
                fromAddress: action.data.tx.from,
                toAddress: action.data.tx.to,
                amount: action.data.tx.amount,
                nonce: action.data.tx.options.nonce,
                block: undefined,
                feeOptions: {
                    gasPrice: action.data.tx.options.gasPrice,
                    gasLimit: action.data.tx.options.gasLimit,
                    usedGas: undefined
                },
                status: TransactionStatus.PENDING
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
        case WALLET_DELETE:
            return state.filter((wallet: IWalletState) => action.data !== wallet.id);

        default:
            break;
    }
    return state;
};
