import { IAction } from '../types';
import { ITransactionState, IAccountState, IWalletsState } from './state';
import {
    WALLET_ADD,
    WALLET_DELETE,
    ACCOUNT_GET_BALANCE,
    TRANSACTION_PUBLISHED,
    ACCOUNT_ADD,
    ACCOUNT_REMOVE,
    WALLET_CHANGE_NAME,
    TOGGLE_TOKEN_ACTIVE,
    UPDATE_TOKEN_ORDER,
    REMOVE_TOKEN,
    ADD_TOKEN
} from './actions';
import { TransactionStatus } from '../../core/wallet/types';
import { REHYDRATE } from 'redux-persist';
import BigNumber from 'bignumber.js';

const intialState: IWalletsState = {};

const newBalance = (oldBalance: any, action: any) => ({
    value: action.data.balance ? action.data.balance : oldBalance?.value,
    inProgress: action.inProgress !== undefined ? oldBalance?.inProgress : action.inProgress,
    timestamp: action.data.balance ? new Date() : oldBalance?.timestamp,
    error: action.error !== undefined ? action.error : undefined
});

export default (state: IWalletsState = intialState, action: IAction) => {
    switch (action.type) {
        case REHYDRATE:
            return action.payload
                ? Object.keys(action.payload.wallets).reduce((out: IWalletsState, id: string) => {
                      out[id] = action.payload.wallets[id];

                      out[id].accounts = out[id].accounts.map((account: IAccountState) => ({
                          ...account,

                          // TODO: remove this
                          balance: {
                              ...account.balance,
                              value: new BigNumber(account.balance?.value || 0)
                          },

                          tokens: Object.keys(account.tokens).reduce(
                              (tokenOut: any, tokenId: string) => {
                                  tokenOut[tokenId] = account.tokens[tokenId];
                                  tokenOut[tokenId].balance.value = new BigNumber(
                                      tokenOut[tokenId].balance.value || 0
                                  );
                                  return tokenOut;
                              },
                              {}
                          )
                      }));

                      out[id].transactions =
                          out[id]?.transactions &&
                          Object.keys(out[id].transactions).reduce((txOut: any, txId: string) => {
                              txOut[txId] = out[id].transactions[txId];
                              txOut[txId].amount = new BigNumber(txOut[txId].amount || 0);
                              return txOut;
                          }, {});

                      return out;
                  }, {})
                : state;

        case WALLET_ADD:
            return {
                ...state,
                [action.data.id]: action.data
            };

        case WALLET_DELETE:
            delete state[action.data];
            return { ...state };

        case WALLET_CHANGE_NAME:
            return {
                ...state,
                [action.data.walletId]: {
                    ...state[action.data.walletId],
                    name: action.data.newName
                }
            };

        case ACCOUNT_GET_BALANCE: {
            state = { ...state };

            return {
                ...state,
                [action.data.walletId]: {
                    ...state[action.data.walletId],
                    accounts: state[action.data.walletId].accounts.map(account => {
                        if (
                            account.address === action.data.address &&
                            account.blockchain === action.data.blockchain
                        ) {
                            account.tokens[action.data.token].balance = newBalance(
                                account.tokens[action.data.token].balance,
                                action
                            );
                        }

                        return account;
                    })
                }
            };
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

            return {
                ...state,
                [action.data.walletId]: {
                    ...state[action.data.walletId],
                    transactions: {
                        ...state[action.data.walletId].transactions,
                        [action.data.hash]: transaction
                    }
                }
            };

        case ACCOUNT_ADD:
            return {
                ...state,
                [action.data.walletId]: {
                    ...state[action.data.walletId],
                    accounts: [].concat(
                        state[action.data.walletId].accounts,
                        state[action.data.walletId].accounts.some(
                            account =>
                                account &&
                                account.address === action.data.account.address &&
                                account.blockchain === action.data.account.blockchain
                        )
                            ? []
                            : [action.data.account]
                    )
                }
            };

        case ACCOUNT_REMOVE:
            return {
                ...state,
                [action.data.walletId]: {
                    ...state[action.data.walletId],
                    accounts: state[action.data.walletId].accounts.filter(
                        account =>
                            !(
                                account.address === action.data.account.address &&
                                account.blockchain === action.data.account.blockchain
                            )
                    )
                }
            };

        case TOGGLE_TOKEN_ACTIVE:
            const token = action.data.token;
            token.active = !token.active;

            return {
                ...state,
                [action.data.walletId]: {
                    ...state[action.data.walletId],
                    accounts: state[action.data.walletId].accounts.map(account =>
                        account.address === action.data.account.address &&
                        account.blockchain === action.data.account.blockchain
                            ? {
                                  ...account,
                                  tokens: {
                                      ...account.tokens,
                                      [action.data.token.symbol]: token
                                  }
                              }
                            : account
                    )
                }
            };

        case UPDATE_TOKEN_ORDER:
            return {
                ...state,
                [action.data.walletId]: {
                    ...state[action.data.walletId],
                    accounts: state[action.data.walletId].accounts.map(account =>
                        account.address === action.data.account.address &&
                        account.blockchain === action.data.account.blockchain
                            ? {
                                  ...account,
                                  tokens: action.data.tokens
                              }
                            : account
                    )
                }
            };

        case REMOVE_TOKEN:
            const accountToRemoveToken = state[action.data.walletId].accounts.find(
                account =>
                    account.address === action.data.account.address &&
                    account.blockchain === action.data.account.blockchain
            );

            delete accountToRemoveToken.tokens[action.data.token.symbol];

            return {
                ...state,
                [action.data.walletId]: {
                    ...state[action.data.walletId],
                    accounts: state[action.data.walletId].accounts.map(account =>
                        account.address === action.data.account.address &&
                        account.blockchain === action.data.account.blockchain
                            ? accountToRemoveToken
                            : account
                    )
                }
            };

        case ADD_TOKEN:
            const accountToAddToken = state[action.data.walletId].accounts.find(
                account =>
                    account.address === action.data.account.address &&
                    account.blockchain === action.data.account.blockchain
            );

            accountToAddToken.tokens[action.data.token.symbol] = action.data.token;

            return {
                ...state,
                [action.data.walletId]: {
                    ...state[action.data.walletId],
                    accounts: state[action.data.walletId].accounts.map(account =>
                        account.address === action.data.account.address &&
                        account.blockchain === action.data.account.blockchain
                            ? accountToAddToken
                            : account
                    )
                }
            };

        default:
            break;
    }
    return state;
};
