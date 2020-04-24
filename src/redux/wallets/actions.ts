import { HDWallet } from '../../core/wallet/hd-wallet/hd-wallet';
import {
    Blockchain,
    IFeeOptions,
    TransactionMessageText,
    TransactionMessageType,
    ITransferTransactionExtraFields,
    ChainIdType
} from '../../core/blockchain/types';
import { WalletType, IWallet, TransactionStatus } from '../../core/wallet/types';
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
    toInitialState
} from '../ui/screens/connectHardwareWallet/actions';
import { HWWalletFactory } from '../../core/wallet/hw-wallet/hw-wallet-factory';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { LedgerWallet } from '../../core/wallet/hw-wallet/ledger/ledger-wallet';
import { translate } from '../../core/i18n';
import { REHYDRATE } from 'redux-persist';
import { TokenType } from '../../core/blockchain/types/token';
import { NavigationService } from '../../navigation/navigation-service';
import {
    getSelectedWallet,
    getAccounts,
    getSelectedAccount,
    getWalletWithAddress,
    getWalletAndTransactionForHash
} from './selectors';
import { getChainId } from '../preferences/selectors';
import { Client as NearClient } from '../../core/blockchain/near/client';
import { enableCreateAccount, disableCreateAccount } from '../ui/screens/dashboard/actions';
import { openLoadingModal, closeLoadingModal, DISPLAY_MESSAGE } from '../ui/loading-modal/actions';
import { formatAddress } from '../../core/utils/format-address';
import { Notifications } from '../../core/messaging/notifications/notifications';
import { formatNumber } from '../../core/utils/format-number';
import BigNumber from 'bignumber.js';
import { NotificationType } from '../../core/messaging/types';
import { updateAddressMonitorTokens } from '../../core/address-monitor/index';
import { Dialog } from '../../components/dialog/dialog';
import { setDisplayPasswordModal } from '../ui/password-modal/actions';
import { getTokenConfig, generateAccountTokenState } from '../tokens/static-selectors';
import { ITokenState } from '../wallets/state';
import {
    getEncryptionKey,
    generateEncryptionKey,
    clearEncryptionKey,
    clearPinCode
} from '../../core/secure/keychain';
import { delay } from '../../core/utils/time';
import { toggleBiometricAuth } from '../preferences/actions';

// actions consts
export const WALLET_ADD = 'WALLET_ADD';
export const WALLET_DELETE = 'WALLET_DELETE';
export const WALLET_CHANGE_NAME = 'WALLET_CHANGE_NAME';
export const ACCOUNT_GET_BALANCE = 'ACCOUNT_GET_BALANCE';
export const TRANSACTION_PUBLISHED = 'TRANSACTION_PUBLISHED';
export const TRANSACTION_UPSERT = 'TRANSACTION_UPSERT';
export const ACCOUNT_ADD = 'ACCOUNT_ADD';
export const ACCOUNT_REMOVE = 'ACCOUNT_REMOVE';
export const TOGGLE_TOKEN_ACTIVE = 'TOGGLE_TOKEN_ACTIVE';
export const UPDATE_TOKEN_ORDER = 'UPDATE_TOKEN_ORDER';
export const REMOVE_TOKEN_FROM_ACCOUNT = 'REMOVE_TOKEN_FROM_ACCOUNT';
export const ADD_TOKEN_TO_ACCOUNT = 'ADD_TOKEN_TO_ACCOUNT';
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
        const chainId = getChainId(state, selectedAccount.blockchain);
        if (selectedAccount.tokens && selectedAccount.tokens[chainId] === undefined) {
            generateTokensForChainId(blockchain, chainId)(dispatch, getState);
        }
    }
};

export const setSelectedAccount = (account: IAccountState) => (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const state = getState();
    const wallet = getSelectedWallet(state);

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
        dispatch(setDisplayPasswordModal(false));

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
        updateAddressMonitorTokens(getState().wallets);

        NavigationService.navigate('MainNavigation', {});
        NavigationService.navigate('Dashboard', {});

        dispatch(toInitialState());
        dispatch(setDisplayPasswordModal(true));
    } catch (e) {
        dispatch(setDisplayPasswordModal(true));

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

    // TODO: check here and find a solution to fix
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
            wallet.getAccounts(Blockchain.ETHEREUM, 4),
            wallet.getAccounts(Blockchain.CELO, 0),
            wallet.getAccounts(Blockchain.CELO, 1),
            wallet.getAccounts(Blockchain.CELO, 2),
            wallet.getAccounts(Blockchain.CELO, 3),
            wallet.getAccounts(Blockchain.CELO, 4),
            wallet.getAccounts(Blockchain.COSMOS, 0),
            wallet.getAccounts(Blockchain.COSMOS, 1),
            wallet.getAccounts(Blockchain.COSMOS, 2),
            wallet.getAccounts(Blockchain.COSMOS, 3),
            wallet.getAccounts(Blockchain.COSMOS, 4)
        ]).then(async data => {
            data[0][0].selected = true; // first zil account
            //   data[5][0].selected = true; // first eth account
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

            const encryptionKey = await getEncryptionKey(password);
            await storeEncrypted(mnemonic, walletId, encryptionKey);

            dispatch(setSelectedWallet(walletId));
            callback && callback();
            closeLoadingModal()(dispatch, getState);

            updateAddressMonitorTokens(getState().wallets);
        });
    } catch (e) {
        // console.log(e);
        // TODO best way to handle this?
        closeLoadingModal()(dispatch, getState);
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
    const chainId = getChainId(state, blockchain);
    if (wallet === undefined) {
        return;
    }
    const account = wallet.accounts.filter(
        acc => acc.address === address && acc.blockchain === blockchain
    )[0];

    if (token) {
        const balanceInProgress = account?.tokens[chainId][token]?.balance?.inProgress;
        const balanceTimestamp = account?.tokens[chainId][token]?.balance?.timestamp || 0;

        if (force || (!balanceInProgress && balanceTimestamp + 10 * 3600 < Date.now())) {
            const data = {
                walletId: wallet.id,
                address,
                token,
                blockchain,
                chainId
            };

            dispatch({
                type: ACCOUNT_GET_BALANCE,
                data,
                inProgress: true
            });
            try {
                const tokenConfig = getTokenConfig(account.blockchain, token);
                const client = getBlockchain(blockchain).getClient(chainId);

                let balance;
                switch (tokenConfig.type) {
                    case TokenType.NATIVE: {
                        balance = await client.getBalance(address);
                        break;
                    }
                    default:
                        if (client.tokens[tokenConfig.type]) {
                            balance = await client.tokens[tokenConfig.type].getBalance(
                                tokenConfig.contractAddress,
                                address
                            );
                        } else {
                            throw new Error(
                                `Token Type (${tokenConfig.type}) not handled for blockchain ${blockchain}.`
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
        Object.keys(account.tokens[chainId] || {}).map(tokenSymbol => {
            // console.log(`getBalance(${blockchain}, ${address}, ${tokenSymbol}, ${force})`);
            getBalance(blockchain, address, tokenSymbol, force)(dispatch, getState);
        });
    }
};

export const updateTransactionFromBlockchain = (
    transactionHash: string,
    blockchain: Blockchain,
    chainId: string | number,
    broadcastedOnBlock: number,
    displayNotification: boolean,
    navigateToTransaction: boolean = false
) => async (dispatch, getState: () => IReduxState) => {
    const state = getState();
    const blockchainInstance = getBlockchain(blockchain);
    const client = blockchainInstance.getClient(chainId);
    let transaction;

    try {
        transaction = await client.utils.getTransaction(transactionHash);
    } catch (e) {
        const currentBlock = await client.getCurrentBlock();
        if (
            currentBlock.number - broadcastedOnBlock >
            blockchainInstance.config.droppedTxBlocksThreshold
        ) {
            const response = getWalletAndTransactionForHash(state, transactionHash);
            if (response) {
                transaction = {
                    ...response.transaction,
                    status: TransactionStatus.DROPPED
                };
                dispatch({
                    type: TRANSACTION_UPSERT,
                    data: {
                        walletId: response.walletId,
                        transaction
                    }
                });
            }
        }
        return;
    }

    // search for wallets/accounts affected by this transaction
    const receivingAddress =
        transaction.token.symbol === blockchainInstance.config.coin
            ? transaction.toAddress
            : transaction.data?.params[0];

    const wallets = getWalletWithAddress(
        state,
        [transaction.address, receivingAddress],
        blockchain
    );

    if (wallets) {
        wallets.forEach(wlt => {
            dispatch({
                type: TRANSACTION_UPSERT,
                data: {
                    walletId: wlt.id,
                    transaction
                }
            });
        });

        // select notification wallet and account
        // if two wallets (transferring between own wallets) select the receiving wallet
        const wallet =
            wallets.length > 1
                ? wallets.find(loopWallet =>
                      loopWallet.accounts.some(
                          account => account.address.toLowerCase() === receivingAddress
                      )
                  )
                : wallets[0];

        const transactionAccount =
            wallet.accounts.find(account => account.address.toLowerCase() === receivingAddress) ||
            wallet.accounts.find(account => account.address.toLowerCase() === transaction.address);

        // update balance
        getBalance(
            blockchain,
            transactionAccount.address,
            transaction.token.symbol,
            true
        )(dispatch, getState);

        // const currentChainId = getChainId(state, blockchain);
        // if (displayNotification && currentChainId === chainId) { - removed this for consistency with app closed notifications

        const tokenConfig = getTokenConfig(blockchain, transaction.token.symbol);

        if (displayNotification) {
            const amount = blockchainInstance.account.amountFromStd(
                new BigNumber(blockchainInstance.transaction.getTransactionAmount(transaction))
            );
            const formattedAmount = formatNumber(amount, {
                currency: transaction.token.symbol
            });

            Notifications.displayNotification(
                transaction.status,
                `Transaction of ${formattedAmount} from ${formatAddress(
                    transaction.address,
                    blockchain
                )} to ${formatAddress(receivingAddress, blockchain)}`,
                {
                    type: NotificationType.TRANSACTION_UPDATE,
                    data: {
                        walletId: wallet.id,
                        accountIndex: transactionAccount.index,
                        token: generateAccountTokenState(tokenConfig),
                        tokenLogo: tokenConfig.icon,
                        blockchain
                    }
                }
            );
        }

        if (navigateToTransaction) {
            const navigationParams: NavigationParams = {
                blockchain,
                accountIndex: transactionAccount.index,
                token: generateAccountTokenState(tokenConfig),
                tokenLogo: tokenConfig.icon
            };

            dispatch(setSelectedWallet(wallet.id));
            NavigationService.navigate('Token', navigationParams);
        }
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
    extraFields: ITransferTransactionExtraFields,
    goBack: boolean = true
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    const appWallet = getSelectedWallet(state);

    dispatch(openLoadingModal());

    try {
        dispatch({
            type: DISPLAY_MESSAGE,
            data: {
                text:
                    appWallet.type === WalletType.HW
                        ? TransactionMessageText.CONNECTING_LEDGER
                        : TransactionMessageText.SIGNING,
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
        const tokenConfig = getTokenConfig(account.blockchain, token);

        const tx = await blockchainInstance.transaction.buildTransferTransaction({
            chainId,
            account,
            toAddress,
            amount: blockchainInstance.account.amountToStd(amount, tokenConfig.decimals).toFixed(),
            token,
            feeOptions: {
                gasPrice: feeOptions.gasPrice.toString(),
                gasLimit: feeOptions.gasLimit.toString()
            },
            extraFields
        });

        if (appWallet.type === WalletType.HW) {
            dispatch({
                type: DISPLAY_MESSAGE,
                data: {
                    text: TransactionMessageText.OPEN_APP,
                    type: TransactionMessageType.INFO
                }
            });
            await (wallet as LedgerWallet).onAppOpened(account.blockchain);

            dispatch({
                type: DISPLAY_MESSAGE,
                data: {
                    text: TransactionMessageText.REVIEW_TRANSACTION,
                    type: TransactionMessageType.INFO
                }
            });
        }
        const transaction = await wallet.sign(account.blockchain, account.index, tx);

        dispatch({
            type: DISPLAY_MESSAGE,
            data: {
                text: TransactionMessageText.BROADCASTING,
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
            closeLoadingModal()(dispatch, getState);
            goBack && navigation.goBack();
            return;
        }
    } catch (errorMessage) {
        closeLoadingModal()(dispatch, getState);

        // TODO: check here and find a solution to fix
        // await delay(500);

        const message = translate('LoadingModal.' + errorMessage, {
            app: account.blockchain,
            address: formatAddress(toAddress, account.blockchain)
        });

        Dialog.alert(
            translate('LoadingModal.txFailed'),
            message,
            {
                text: translate('App.labels.cancel'),
                onPress: () => {
                    //
                }
            },
            {
                text: translate('App.labels.tryAgain'),
                onPress: () => {
                    //
                }
            }
        );
    }
};

export const deleteWallet = (walletId: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const state = getState();
    if (getSelectedWallet(state).id === walletId) {
        const nextWallet = Object.values(state.wallets).find(wallet => wallet.id !== walletId);
        if (nextWallet) {
            dispatch(setSelectedWallet(nextWallet.id));
        } else {
            // Clear Keychain Storage and reset Biometric Settings
            clearPinCode();
            await clearEncryptionKey();
            if (state.preferences.biometricActive) {
                // Disable biometric auth
                dispatch(toggleBiometricAuth());
            }
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
    account: IAccountState,
    token: ITokenState,
    chainId: ChainIdType
) => (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    const selectedWallet: IWalletState = getSelectedWallet(getState());
    dispatch({
        type: TOGGLE_TOKEN_ACTIVE,
        data: { walletId: selectedWallet.id, account, token, chainId }
    });
};

export const updateTokenOrder = (
    account: IAccountState,
    tokens: ITokenState[],
    chainId: ChainIdType
) => (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    const selectedWallet: IWalletState = getSelectedWallet(getState());
    dispatch({
        type: UPDATE_TOKEN_ORDER,
        data: { walletId: selectedWallet.id, account, tokens, chainId }
    });
};

export const removeTokenFromAccount = (
    account: IAccountState,
    token: ITokenState,
    chainId: ChainIdType
) => (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    const selectedWallet: IWalletState = getSelectedWallet(getState());
    dispatch({
        type: REMOVE_TOKEN_FROM_ACCOUNT,
        data: { walletId: selectedWallet.id, account, token, chainId }
    });
};

export const generateTokensForChainId = (blockchain: Blockchain, chainId: ChainIdType) => (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const tokens = getBlockchain(blockchain).config.tokens;
    const accounts = getAccounts(getState(), blockchain);

    accounts.map(account => {
        Object.keys(tokens).map(symbol => {
            addTokenToAccount(
                account,
                generateAccountTokenState(getTokenConfig(blockchain, symbol), account, chainId),
                chainId
            )(dispatch, getState);
        });
    });
};

export const addTokenToAccount = (
    account: IAccountState,
    token: ITokenState,
    chainId?: ChainIdType
) => (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    const selectedWallet: IWalletState = getSelectedWallet(getState());
    const chainIdValue = chainId ? chainId : getChainId(getState(), account.blockchain);
    dispatch({
        type: ADD_TOKEN_TO_ACCOUNT,
        data: { walletId: selectedWallet.id, account, token, chainId: chainIdValue }
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

        account.tokens[chainId][blockchainInstance.config.coin].balance = {
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

    const encryptionKey = await getEncryptionKey(oldPassword);
    const newEncryptionKey = await generateEncryptionKey(newPassword);

    Object.values(state.wallets).map(async (wallet: IWalletState) => {
        const walletId = wallet.id;

        const mnemonic = await readEncrypted(walletId, encryptionKey);

        await storeEncrypted(mnemonic, walletId, newEncryptionKey);
    });
};
