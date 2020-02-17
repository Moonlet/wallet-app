import { HDWallet } from '../../core/wallet/hd-wallet/hd-wallet';
import {
    Blockchain,
    IFeeOptions,
    TransactionMessageText,
    TransactionMessageType
} from '../../core/blockchain/types';
import { WalletType, IWallet } from '../../core/wallet/types';
import { IWalletState, IAccountState } from './state';
import { IAction } from '../types';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import uuidv4 from 'uuid/v4';
import { storeEncrypted, deleteFromStorage, readEncrypted } from '../../core/secure/storage';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { WalletFactory } from '../../core/wallet/wallet-factory';
import { HWVendor, HWModel, HWConnection } from '../../core/wallet/hw-wallet/types';
import {
    verifyAddressOnDevice,
    featureNotSupported,
    toInitialState,
    connectInProgress
} from '../ui/screens/connectHardwareWallet/actions';
import { HWWalletFactory } from '../../core/wallet/hw-wallet/hw-wallet-factory';
import { NavigationScreenProp, NavigationState } from 'react-navigation';
import { LedgerWallet } from '../../core/wallet/hw-wallet/ledger/ledger-wallet';
import { translate } from '../../core/i18n';
import { DISPLAY_MESSAGE } from '../ui/screens/send/actions';
import { REHYDRATE } from 'redux-persist';
import { TokenType, ITokenConfig } from '../../core/blockchain/types/token';
import { NavigationService } from '../../navigation/navigation-service';
import { BottomSheetType } from '../ui/bottomSheet/state';
import { closeBottomSheet, openBottomSheet } from '../ui/bottomSheet/actions';
import { getSelectedWallet, getAccounts, getSelectedAccount } from './selectors';
import { getChainId } from '../preferences/selectors';
import { Client as NearClient } from '../../core/blockchain/near/client';
import { enableCreateAccount, disableCreateAccount } from '../ui/screens/dashboard/actions';
import { openLoadingModal, closeLoadingModal } from '../ui/loading-modal/actions';
import { delay } from '../../core/utils/time';

// actions consts
export const WALLET_ADD = 'WALLET_ADD';
export const WALLET_DELETE = 'WALLET_DELETE';
export const WALLET_CHANGE_NAME = 'WALLET_CHANGE_NAME';
export const ACCOUNT_GET_BALANCE = 'ACCOUNT_GET_BALANCE';
export const TRANSACTION_PUBLISHED = 'TRANSACTION_PUBLISHED';
export const ACCOUNT_ADD = 'ACCOUNT_ADD';
export const ACCOUNT_REMOVE = 'ACCOUNT_REMOVE';
export const TOGGLE_TOKEN_ACTIVE = 'TOGGLE_TOKEN_ACTIVE';
export const UPDATE_TOKEN_ORDER = 'UPDATE_TOKEN_ORDER';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';
export const ADD_TOKEN = 'ADD_TOKEN';
export const WALLET_SELECT_ACCOUNT = 'WALLET_SELECT_ACCOUNT';
export const WALLET_SELECT_BLOCKCHAIN = 'WALLET_SELECT_BLOCKCHAIN';
export const SELECT_WALLET = 'SELECT_WALLET';

// action creators
export const addWallet = (walletData: IWalletState) => {
    return {
        type: WALLET_ADD,
        data: walletData
    };
};

export const setSelectedWallet = (walletId: string) => {
    return {
        type: SELECT_WALLET,
        data: walletId
    };
};

export const setSelectedBlockchain = (blockchain: Blockchain) => (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const state = getState();
    const wallet = getSelectedWallet(state);
    if (wallet === undefined) {
        return;
    }
    dispatch({
        type: WALLET_SELECT_BLOCKCHAIN,
        data: {
            walletId: wallet.id,
            blockchain
        }
    });

    if (blockchain === Blockchain.NEAR) {
        if (getAccounts(state, blockchain).length === 0) {
            dispatch(enableCreateAccount());
        } else {
            dispatch(disableCreateAccount());
        }
    } else {
        dispatch(disableCreateAccount());
    }
    const selectedAccount = getSelectedAccount(getState());
    if (selectedAccount) {
        getBalance(
            selectedAccount.blockchain,
            selectedAccount.address,
            undefined,
            true
        )(dispatch, getState);
    }
};

export const setSelectedAccount = (account: IAccountState) => (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const wallet = getSelectedWallet(getState());
    if (wallet === undefined) {
        return;
    }
    dispatch({
        type: WALLET_SELECT_ACCOUNT,
        data: {
            walletId: wallet.id,
            blockchain: account.blockchain,
            index: account.index
        }
    });
};

export const updateReduxState = (state: IReduxState) => dispatch => {
    dispatch({
        type: REHYDRATE,
        payload: state
    });
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

export const createHWWallet = (
    deviceId: string,
    deviceVendor: HWVendor,
    deviceModel: HWModel,
    connectionType: HWConnection,
    blockchain: Blockchain
    // navigation: NavigationScreenProp<NavigationState>
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    try {
        const walletId: string = uuidv4();

        // in case you replace your connected ledger reset message
        dispatch(toInitialState());
        dispatch(connectInProgress());

        const wallet = await HWWalletFactory.get(
            deviceVendor,
            deviceModel,
            deviceId,
            connectionType
        );

        await (wallet as LedgerWallet).onAppOpened(blockchain);

        dispatch(verifyAddressOnDevice(true));
        const accounts: IAccountState[] = await wallet.getAccounts(blockchain, 0);
        accounts[0].selected = true;
        const walletData: IWalletState = {
            id: walletId,
            selected: false,
            selectedBlockchain: blockchain,
            hwOptions: {
                deviceId,
                deviceVendor,
                deviceModel,
                connectionType
            },
            name: `Wallet ${Object.keys(getState().wallets).length + 1}`,
            type: WalletType.HW,
            accounts
        };

        dispatch(addWallet(walletData));

        dispatch(setSelectedWallet(walletId));
        NavigationService.navigate('MainNavigation', {});
        NavigationService.navigate('Dashboard', {}); // TODO: check this

        dispatch(toInitialState());
    } catch (e) {
        // this might not be the best place
        if (e === translate('CreateHardwareWallet.notSupported')) {
            dispatch(featureNotSupported());
        }
        throw new Error(e);
    }
};

export const createHDWallet = (mnemonic: string, password: string, callback?: () => any) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    dispatch(openLoadingModal());
    await delay(0);

    try {
        const wallet = new HDWallet(mnemonic);

        // generate initial accounts for each blockchain
        Promise.all([
            wallet.getAccounts(Blockchain.ZILLIQA, 0),
            wallet.getAccounts(Blockchain.ZILLIQA, 1),
            wallet.getAccounts(Blockchain.ZILLIQA, 2),
            wallet.getAccounts(Blockchain.ZILLIQA, 3),
            wallet.getAccounts(Blockchain.ZILLIQA, 4),
            wallet.getAccounts(Blockchain.ETHEREUM, 0),
            wallet.getAccounts(Blockchain.ETHEREUM, 1),
            wallet.getAccounts(Blockchain.ETHEREUM, 2),
            wallet.getAccounts(Blockchain.ETHEREUM, 3),
            wallet.getAccounts(Blockchain.ETHEREUM, 4)
        ]).then(async data => {
            data[0][0].selected = true; // first zil account
            data[5][0].selected = true; // first eth account
            const walletId = uuidv4();
            const accounts: IAccountState[] = data.reduce((out, acc) => out.concat(acc), []);

            dispatch(
                addWallet({
                    id: walletId,
                    selected: false,
                    selectedBlockchain: Blockchain.ZILLIQA, // by default the first blockchain is selected
                    name: `Wallet ${Object.keys(getState().wallets).length + 1}`,
                    type: WalletType.HD,
                    accounts
                })
            );

            await storeEncrypted(mnemonic, walletId, password);

            dispatch(setSelectedWallet(walletId));
            callback && callback();
            dispatch(closeLoadingModal());
        });
    } catch (e) {
        // console.log(e);
        // TODO best way to handle this?
        dispatch(closeLoadingModal());
    }
    // TODO  - error handling
};

// will check balance for a coin or all coins if needed
export const getBalance = (
    blockchain: Blockchain,
    address: string,
    token: string = undefined,
    force: boolean = false
) => async (dispatch, getState: () => IReduxState) => {
    const state = getState();
    const wallet = getSelectedWallet(state);
    if (wallet === undefined) {
        return;
    }
    const account = wallet.accounts.filter(
        acc => acc.address === address && acc.blockchain === blockchain
    )[0];

    if (token) {
        const balanceInProgress = account?.tokens[token]?.balance?.inProgress;
        const balanceTimestamp = account?.tokens[token]?.balance?.timestamp || 0;

        if (force || (!balanceInProgress && balanceTimestamp + 10 * 3600 < Date.now())) {
            const data = {
                walletId: wallet.id,
                address,
                token,
                blockchain
            };

            dispatch({
                type: ACCOUNT_GET_BALANCE,
                data,
                inProgress: true
            });
            try {
                const chainId = getChainId(state, account.blockchain);
                const tokenInfo = account.tokens[token];
                const client = getBlockchain(blockchain).getClient(chainId);

                let balance;
                switch (tokenInfo.type) {
                    case TokenType.NATIVE:
                        balance = await client.getBalance(address);
                        break;
                    default:
                        if (client.tokens[tokenInfo.type]) {
                            balance = await client.tokens[tokenInfo.type].getBalance(
                                tokenInfo.contractAddress,
                                address
                            );
                        } else {
                            throw new Error(
                                `Token Type (${tokenInfo.type}) not handled for blockchain ${blockchain}.`
                            );
                        }
                }

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
                    data,
                    error
                });
            }
        }
    } else {
        // call get balance for all tokens
        Object.keys(account.tokens || {}).map(tokenSymbol => {
            // console.log(`getBalance(${blockchain}, ${address}, ${tokenSymbol}, ${force})`);
            getBalance(blockchain, address, tokenSymbol, force)(dispatch, getState);
        });
    }
};

export const sendTransferTransaction = (
    account: IAccountState,
    toAddress: string,
    amount: string,
    token: string,
    feeOptions: IFeeOptions,
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    goBack: boolean = true
) => async (dispatch, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    const appWallet = getSelectedWallet(state);
    dispatch(openLoadingModal());

    dispatch(
        openBottomSheet(BottomSheetType.SEND_TRANSACTION, {
            blockchain: account.blockchain
        })
    );

    try {
        dispatch({
            type: DISPLAY_MESSAGE,
            data: {
                message: TransactionMessageText.SIGNING,
                type: TransactionMessageType.INFO
            }
        });
        const wallet = await WalletFactory.get(appWallet.id, appWallet.type, {
            pass: password,
            deviceVendor: appWallet.hwOptions?.deviceVendor,
            deviceModel: appWallet.hwOptions?.deviceModel,
            deviceId: appWallet.hwOptions?.deviceId,
            connectionType: appWallet.hwOptions?.connectionType
        }); // encrypted string: pass)
        const blockchainInstance = getBlockchain(account.blockchain);
        const client = blockchainInstance.getClient(chainId);

        const nonce = await client.getNonce(account.address, account.publicKey);
        const blockInfo = await client.getCurrentBlock();

        const tx = blockchainInstance.transaction.buildTransferTransaction({
            chainId,
            account,
            toAddress,
            amount: blockchainInstance.account
                .amountToStd(amount, account.tokens[token].decimals)
                .toFixed(),
            token,
            nonce,
            currentBlockHash: blockInfo.hash,
            currentBlockNumber: blockInfo.number,
            feeOptions: {
                gasPrice: feeOptions.gasPrice.toString(),
                gasLimit: feeOptions.gasLimit.toString()
            }
        });

        if (appWallet.type === WalletType.HW) {
            dispatch({
                type: DISPLAY_MESSAGE,
                data: {
                    message: TransactionMessageText.OPEN_APP,
                    type: TransactionMessageType.INFO
                }
            });
            await (wallet as LedgerWallet).onAppOpened(account.blockchain);

            dispatch({
                type: DISPLAY_MESSAGE,
                data: {
                    message: TransactionMessageText.REVIEW_TRANSACTION,
                    type: TransactionMessageType.INFO
                }
            });
        }
        const transaction = await wallet.sign(account.blockchain, account.index, tx);

        dispatch({
            type: DISPLAY_MESSAGE,
            data: {
                message: TransactionMessageText.BROADCASTING,
                type: TransactionMessageType.INFO
            }
        });

        const txHash = await getBlockchain(account.blockchain)
            .getClient(chainId)
            .sendTransaction(transaction);

        if (txHash) {
            dispatch({
                type: TRANSACTION_PUBLISHED,
                data: {
                    hash: txHash,
                    tx,
                    walletId: appWallet.id
                }
            });
            dispatch({
                type: DISPLAY_MESSAGE,
                data: undefined
            });
            dispatch(closeBottomSheet());
            goBack && navigation.goBack();
            dispatch(closeLoadingModal());
            return;
        }
    } catch (errorMessage) {
        dispatch(closeLoadingModal());
        dispatch({
            type: DISPLAY_MESSAGE,
            data: {
                message: errorMessage,
                type: TransactionMessageType.ERROR
            }
        });
    }
};

export const deleteWallet = (walletId: string) => (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const state = getState();
    if (getSelectedWallet(state).id === walletId) {
        const nextWallet = Object.values(state.wallets).find(wallet => wallet.id !== walletId);
        if (nextWallet) {
            dispatch(setSelectedWallet(nextWallet.id));
        }
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

export const toggleTokenActive = (
    walletId: string,
    account: IAccountState,
    token: ITokenConfig
) => {
    return {
        type: TOGGLE_TOKEN_ACTIVE,
        data: { walletId, account, token }
    };
};

export const updateTokenOrder = (
    walletId: string,
    account: IAccountState,
    tokens: ITokenConfig[]
) => {
    return {
        type: UPDATE_TOKEN_ORDER,
        data: { walletId, account, tokens }
    };
};

export const removeToken = (walletId: string, account: IAccountState, token: ITokenConfig) => {
    return {
        type: REMOVE_TOKEN,
        data: { walletId, account, token }
    };
};

export const addToken = (walletId: string, account: IAccountState, token: ITokenConfig) => (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    dispatch({
        type: ADD_TOKEN,
        data: { walletId, account, token }
    });
    getBalance(account.blockchain, account.address, undefined, true)(dispatch, getState);
};

export const createAccount = (
    blockchain: Blockchain,
    newAccountId: string,
    password: string
) => async (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    const state = getState();
    const selectedWallet: IWalletState = getSelectedWallet(state);
    const hdWallet: IWallet = await WalletFactory.get(selectedWallet.id, selectedWallet.type, {
        pass: password
    });
    blockchain = Blockchain.NEAR;
    const chainId = getChainId(state, blockchain);

    const numberOfAccounts = selectedWallet.accounts.filter(acc => acc.blockchain === blockchain)
        .length;

    const accounts = await hdWallet.getAccounts(blockchain, numberOfAccounts);
    const account = accounts[0];
    const publicKey = account.publicKey;

    const blockchainInstance = getBlockchain(blockchain);
    const client = blockchainInstance.getClient(chainId) as NearClient;

    const txId = await client.createAccount(newAccountId, publicKey, chainId);

    if (txId) {
        account.address = newAccountId;

        account.tokens[blockchain].balance = {
            value: '0',
            inProgress: false,
            timestamp: undefined,
            error: undefined
        };

        dispatch(addAccount(selectedWallet.id, blockchain, account));
        dispatch(setSelectedAccount(account));
        dispatch(disableCreateAccount());
    } else {
        // TODO - if client.createAccount crashes, dashboard (near create account section) will be stuck on loading indicator
    }
};

export const changePIN = (newPassword: string, oldPassword: string) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();

    Object.values(state.wallets).map(async (wallet: IWalletState) => {
        const walletId = wallet.id;

        const mnemonic = await readEncrypted(walletId, oldPassword);

        await storeEncrypted(mnemonic, walletId, newPassword);
    });
};
