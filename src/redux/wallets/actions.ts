import { HDWallet } from '../../core/wallet/hd-wallet/hd-wallet';
import { Blockchain } from '../../core/blockchain/types';
import { WalletType } from '../../core/wallet/types';
import { IWalletState, IAccountState } from './state';
import { IAction } from '../types';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { getChainId } from '../app/selectors';
import { appSwitchWallet } from '../app/actions';
import uuidv4 from 'uuid/v4';
import { getPassword } from '../../core/secure/keychain';
import { storeEncrypted, deleteFromStorage } from '../../core/secure/storage';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { WalletFactory } from '../../core/wallet/wallet-factory';
import { selectCurrentWallet } from './selectors';

// actions consts
export const WALLET_ADD = 'WALLET_ADD';
export const WALLET_DELETE = 'WALLET_DELETE';
export const WALLET_CHANGE_NAME = 'WALLET_CHANGE_NAME';
export const ACCOUNT_GET_BALANCE = 'ACCOUNT_GET_BALANCE';
export const TRANSACTION_PUBLISHED = 'TRANSACTION_PUBLISHED';
export const ACCOUNT_ADD = 'ACCOUNT_ADD';
export const ACCOUNT_REMOVE = 'ACCOUNT_REMOVE';

export const FEE = {
    [Blockchain.ZILLIQA]: {
        gasPrice: 1000,
        gasLimit: 1
    },
    [Blockchain.ETHEREUM]: {
        gasPrice: 20000000000,
        gasLimit: 21000
    }
};

// action creators
export const addWallet = (walletData: IWalletState) => {
    return {
        type: WALLET_ADD,
        data: walletData
    };
};

export const addAccount = (walletId: string, blockchain: Blockchain, account: IAccountState) => {
    return {
        type: ACCOUNT_ADD,
        data: { walletId, account, blockchain }
    };
};

export const removeAccount = (walletId: string, blockchain: Blockchain, account: IAccountState) => {
    return {
        type: ACCOUNT_REMOVE,
        data: { walletId, account, blockchain }
    };
};

export const createHDWallet = (mnemonic: string, callback?: () => any) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    try {
        const wallet = new HDWallet(mnemonic);

        // generate initial accounts for each blockchain
        Promise.all([
            wallet.getAccounts(Blockchain.ETHEREUM, 0),
            wallet.getAccounts(Blockchain.ETHEREUM, 1),
            wallet.getAccounts(Blockchain.ZILLIQA, 0),
            wallet.getAccounts(Blockchain.ZILLIQA, 1)
        ]).then(async data => {
            const walletId = uuidv4();
            dispatch(
                addWallet({
                    id: walletId,
                    name: `Wallet ${getState().wallets.length + 1}`,
                    type: WalletType.HD,
                    accounts: data.reduce((out, accounts) => {
                        return out.concat(accounts);
                    }, [])
                })
            );

            const passwordCredentials = await getPassword();
            let passwordHash = '698bd02da17d4671da826cf833cf23be26a74ff4dd389da3b05bd894f7d97ef5'; // hash('pass')

            if (passwordCredentials) {
                passwordHash = passwordCredentials.password;
            } else {
                // password not in keychain? request pass
            }

            await storeEncrypted(mnemonic, walletId, passwordHash);

            dispatch(appSwitchWallet(walletId));
            callback && callback();
        });
    } catch (e) {
        // console.log(e);
        // TODO best way to handle this?
    }
    // TODO  - error handling
};

export const getBalance = (
    blockchain: Blockchain,
    chainId: number,
    address: string,
    force: boolean = false
) => async (dispatch, getState: () => IReduxState) => {
    const state = getState();
    const wallet = selectCurrentWallet(state);
    if (wallet === undefined) {
        return;
    }
    const account = wallet.accounts.filter(
        acc => acc.address === address && acc.blockchain === blockchain
    )[0];
    const balanceInProgress = account?.balance?.inProgress;
    const balanceTimestamp = account?.balance?.timestamp || 0;

    if (force || (!balanceInProgress && balanceTimestamp + 10 * 3600 < Date.now())) {
        const data = {
            walletId: wallet.id,
            address,
            blockchain
        };

        dispatch({
            type: ACCOUNT_GET_BALANCE,
            data,
            inProgress: true
        });
        try {
            const balance = await getBlockchain(blockchain)
                .getClient(chainId)
                .getBalance(address);
            dispatch({
                type: ACCOUNT_GET_BALANCE,
                data: {
                    ...data,
                    balance
                }
            });
        } catch (error) {
            dispatch({
                type: ACCOUNT_GET_BALANCE,
                walletId: wallet.id,
                error
            });
        }
    }
};

export const sendTransferTransaction = (
    account: IAccountState,
    toAddress: string,
    amount: string,
    feeOptions: any
) => async (dispatch, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    // TODO  - remove after password screen is active
    let encryptedPass = '366bf1f956e204d7bea27145b5afe34cabd6d584100e6b0b5f700230bc52a5f2';
    const passwordCredentials = await getPassword();
    if (passwordCredentials) {
        encryptedPass = passwordCredentials.password;
    } else {
        // ask for password
    }

    const wallet = selectCurrentWallet(state);

    try {
        const hdWallet = await WalletFactory.get(wallet.id, wallet.type, encryptedPass); // encrypted string: pass)
        const blockchainInstance = getBlockchain(account.blockchain);

        const nonce = await blockchainInstance.getClient(chainId).getNonce(account.address);

        const options = {
            nonce,
            chainId,
            gasPrice: feeOptions.gasPrice,
            gasLimit: feeOptions.gasLimit
        };

        const tx = {
            from: account.address,
            to: toAddress,
            amount: blockchainInstance.account.amountToStd(amount),
            options
        };

        const transaction = await hdWallet.sign(account.blockchain, account.index, tx);

        const publish = await getBlockchain(account.blockchain)
            .getClient(chainId)
            .sendTransaction(transaction);
        if (publish) {
            dispatch({
                type: TRANSACTION_PUBLISHED,
                data: {
                    hash: transaction,
                    tx,
                    walletId: wallet.id
                }
            });
            return;
        }
    } catch (e) {
        throw new Error(e);
    }
};

export const deleteWallet = walletId => (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const state = getState();

    if (state.app.currentWalletId === walletId) {
        const nextWallet = state.wallets.find(wallet => wallet.id !== walletId);
        const nextWalletId = nextWallet ? nextWallet.id : '';
        dispatch(appSwitchWallet(nextWalletId));
    }
    dispatch({
        type: WALLET_DELETE,
        data: walletId
    });

    deleteFromStorage(walletId);
};

export const updateWalletName = (walletId: string, newName: string) => {
    return {
        type: WALLET_CHANGE_NAME,
        data: { walletId, newName }
    };
};
