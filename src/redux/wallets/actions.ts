import { HDWallet } from '../../core/wallet/hd-wallet/hd-wallet';
import { Blockchain } from '../../core/blockchain/types';
import { WalletType } from '../../core/wallet/types';
import { IWalletState, IAccountState } from './state';
import { IAction } from '../types';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import uuidv4 from 'uuid/v4';
import { storeEncrypted, deleteFromStorage } from '../../core/secure/storage';
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
import { REVIEW_TRANSACTION } from '../ui/screens/send/actions';
import { ISelectedAccount } from '../wallets/state';
import { REHYDRATE } from 'redux-persist';
import { TokenType, ITokenConfig } from '../../core/blockchain/types/token';
import BigNumber from 'bignumber.js';
import { NavigationService } from '../../navigation/navigation-service';
import { BottomSheetType } from '../ui/bottomSheet/state';
import { closeBottomSheet, openBottomSheet } from '../ui/bottomSheet/actions';
import { getSelectedWallet, getSelectedAccount } from './selectors';
import { getChainId } from '../preferences/selectors';

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
    const wallet = getSelectedWallet(getState());
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
};

export const setSelectedAccount = (selectedAccount: ISelectedAccount) => (
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
            selectedAccount
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
    try {
        const wallet = new HDWallet(mnemonic);

        // generate initial accounts for each blockchain
        Promise.all([
            wallet.getAccounts(Blockchain.ETHEREUM, 0),
            wallet.getAccounts(Blockchain.ETHEREUM, 1),
            wallet.getAccounts(Blockchain.ZILLIQA, 0),
            wallet.getAccounts(Blockchain.ZILLIQA, 1),
            wallet.getAccounts(Blockchain.NEAR, 0)
        ]).then(async data => {
            data[0][0].selected = true;
            //    data[2][0].selected = true;
            const walletId = uuidv4();
            const accounts: IAccountState[] = data.reduce((out, acc) => out.concat(acc), []);

            dispatch(
                addWallet({
                    id: walletId,
                    selected: false,
                    selectedBlockchain: Blockchain.ETHEREUM, // by default the first blockchain is selected
                    name: `Wallet ${Object.keys(getState().wallets).length + 1}`,
                    type: WalletType.HD,
                    accounts
                })
            );

            await storeEncrypted(mnemonic, walletId, password);

            dispatch(setSelectedWallet(walletId));
            callback && callback();
        });
    } catch (e) {
        // console.log(e);
        // TODO best way to handle this?
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

                let balance;
                switch (tokenInfo.type) {
                    case TokenType.NATIVE:
                        balance = await getBlockchain(blockchain)
                            .getClient(chainId)
                            .getBalance(address);
                        break;
                    default:
                        const client = getBlockchain(blockchain).getClient(chainId);
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
    feeOptions: any,
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    goBack: boolean = true
) => async (dispatch, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    const appWallet = getSelectedWallet(state);

    try {
        const wallet = await WalletFactory.get(appWallet.id, appWallet.type, {
            pass: password,
            deviceVendor: appWallet.hwOptions?.deviceVendor,
            deviceModel: appWallet.hwOptions?.deviceModel,
            deviceId: appWallet.hwOptions?.deviceId,
            connectionType: appWallet.hwOptions?.connectionType
        }); // encrypted string: pass)
        const blockchainInstance = getBlockchain(account.blockchain);

        const nonce = await blockchainInstance.getClient(chainId).getNonce(account.address);

        const tx = blockchainInstance.transaction.buildTransferTransaction({
            chainId,
            account,
            toAddress,
            amount: blockchainInstance.account.amountToStd(amount, account.tokens[token].decimals),
            token,
            nonce,
            gasPrice: new BigNumber(feeOptions.gasPrice),
            gasLimit: new BigNumber(feeOptions.gasLimit).toNumber()
        });

        if (appWallet.type === WalletType.HW) {
            dispatch(
                openBottomSheet(BottomSheetType.LEDGER_SIGN_MESSAGES, {
                    blockchain: account.blockchain
                })
            );

            await (wallet as LedgerWallet).onAppOpened(account.blockchain);

            dispatch({
                type: REVIEW_TRANSACTION,
                data: true
            });
        }
        const transaction = await wallet.sign(account.blockchain, account.index, tx);

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
            if (appWallet.type === WalletType.HW) {
                dispatch({
                    type: REVIEW_TRANSACTION,
                    data: false
                });
                dispatch(closeBottomSheet());
            }
            goBack && navigation.goBack();
            return;
        }
    } catch (e) {
        throw new Error(e);
    }
};

export const deleteWallet = (walletId: string) => (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const state = getState();
    if (getSelectedWallet(state).id === walletId) {
        const nextWallet = Object.values(state.wallets).find(wallet => wallet.id !== walletId);
        const nextWalletId = nextWallet ? nextWallet.id : '';
        dispatch(setSelectedWallet(nextWalletId));
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

export const createNearAccount = (blockchain: Blockchain, newAccountId: string) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();

    const blockchainInstance = getBlockchain(blockchain);

    const chainId = 1; // TODO: refactor this to string

    const createAccount = await blockchainInstance
        .getClient(chainId)
        .createAccount(newAccountId, getSelectedAccount(state).publicKey, chainId);

    // console.log('createAccount: ', createAccount);

    return createAccount;
};
