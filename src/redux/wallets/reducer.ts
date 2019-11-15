import { IAction } from '../types';
import { IWalletState } from './state';
// import { WalletType } from '../../core/wallet/types';
// import { Blockchain } from '../../core/blockchain/types';
import { WALLET_ADD, ACCOUNT_GET_BALANCE, TRANSACTION_PUBLISHED } from './actions';

const intialState: IWalletState[] = [];

export default (state: IWalletState[] = intialState, action: IAction) => {
    switch (action.type) {
        case WALLET_ADD:
            //    return [...state, action.data];
            return [action.data]; // this will reset persisted redux wallets
        case ACCOUNT_GET_BALANCE:
            {
                if (action.data !== undefined) {
                    const newState = state;
                    return newState.map(wallet =>
                        wallet.id === action.data.walletId
                            ? {
                                  ...wallet,
                                  accounts: wallet.accounts.map(account =>
                                      account.address === action.data.address
                                          ? {
                                                ...account,
                                                balance: action.data.balance // TODO: here ce ai tu nevoie sa setezi
                                            }
                                          : account
                                  )
                              }
                            : wallet
                    );
                } else {
                    return state;
                }
            }
            break;
        case TRANSACTION_PUBLISHED:
            {
                // const transaction = {
                //     id: '',
                //     date: new Date(),
                //     fromAddress: action.data
                // };
                // const tr = {
                //     action: transaction
                // }

                return [
                    ...state,
                    state.map(wallet =>
                        wallet.id === action.data.walletId
                            ? {
                                  ...wallet,
                                  transactions: wallet.transactions
                              }
                            : wallet
                    )
                ];
            }
            break;
        default:
            break;
    }
    return state;
};
