import * as IExtStorage from '../types';
import { store } from '../../../redux/config';
import { updateTransactionFromBlockchain } from '../../../redux/wallets/actions';

export const buildTransactions = (trimmedWallets: IExtStorage.IStorageWallets) => {
    const state = store.getState();

    Object.keys(trimmedWallets).map((walletId: string) => {
        const wallet = trimmedWallets[walletId];
        const reduxWallet = state.wallets[walletId];

        wallet?.transactions &&
            Object.keys(wallet.transactions).map((txHash: string) => {
                const tx = wallet.transactions[txHash];
                const reduxTransaction = reduxWallet?.transactions[txHash];

                if (reduxTransaction) {
                    // tx already in redux
                } else {
                    store.dispatch(
                        updateTransactionFromBlockchain(
                            txHash,
                            tx.blockchain,
                            tx.chainId,
                            tx.broadcastedOnBlock
                        ) as any
                    );
                }
            });
    });
};
