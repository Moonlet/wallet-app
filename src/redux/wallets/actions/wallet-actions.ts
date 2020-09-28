import { HDWallet } from '../../../core/wallet/hd-wallet/hd-wallet';
import {
    Blockchain,
    IFeeOptions,
    TransactionMessageText,
    TransactionMessageType,
    ITransactionExtraFields,
    ChainIdType,
    IBlockchainTransaction
} from '../../../core/blockchain/types';
import { WalletType, IWallet, TransactionStatus } from '../../../core/wallet/types';
import { IWalletState, IAccountState, ITokenState } from '../state';
import { IAction } from '../../types';
import { Dispatch } from 'react';
import { IReduxState } from '../../state';
import uuidv4 from 'uuid/v4';
import {
    storeEncrypted,
    deleteFromStorage,
    readEncrypted
} from '../../../core/secure/storage/storage';
import { getBlockchain } from '../../../core/blockchain/blockchain-factory';
import { WalletFactory } from '../../../core/wallet/wallet-factory';
import { HWVendor, HWModel, HWConnection } from '../../../core/wallet/hw-wallet/types';

import { HWWalletFactory } from '../../../core/wallet/hw-wallet/hw-wallet-factory';
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation';
import { translate } from '../../../core/i18n';
import { TokenType } from '../../../core/blockchain/types/token';
import { NavigationService } from '../../../navigation/navigation-service';
import {
    getSelectedWallet,
    getAccounts,
    getSelectedAccount,
    getWalletWithAddress,
    getWalletAndTransactionForHash
} from '../selectors';
import { getChainId } from '../../preferences/selectors';
import { formatAddress } from '../../../core/utils/format-address';
import { updateAddressMonitorTokens } from '../../../core/address-monitor/index';
import { Dialog } from '../../../components/dialog/dialog';
import { setDisplayPasswordModal } from '../../ui/password-modal/actions';
import {
    getTokenConfig,
    generateAccountTokenState,
    generateTokensConfig
} from '../../tokens/static-selectors';
import {
    getEncryptionKey,
    generateEncryptionKey,
    clearEncryptionKey,
    clearPinCode,
    getWalletCredentialsKey,
    setWalletCredentialsKey
} from '../../../core/secure/keychain/keychain';
import { delay } from '../../../core/utils/time';
import { toggleBiometricAuth } from '../../preferences/actions';
import { CLOSE_TX_REQUEST, closeTransactionRequest } from '../../ui/transaction-request/actions';
import { ConnectExtension } from '../../../core/connect-extension/connect-extension';
import { LoadingModal } from '../../../components/loading-modal/loading-modal';
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
} from '@sentry/react-native';
import { startNotificationsHandlers } from '../../notifications/actions';
import { ApiClient } from '../../../core/utils/api-client/api-client';
import { Client as NearClient } from '../../../core/blockchain/near/client';
import { NEAR_ACCOUNT_EXTENSIONS } from '../../../core/constants/app';
import { LedgerConnect } from '../../../screens/ledger/ledger-connect';

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
export const SET_WALLET_PUBLIC_KEY = 'SET_WALLET_PUBLIC_KEY';

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
    // deviceId: string,
    deviceVendor: HWVendor,
    deviceModel: HWModel,
    connectionType: HWConnection,
    blockchain: Blockchain
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    try {
        const walletId: string = uuidv4();

        const accountsAndDeviceId = await LedgerConnect.getAccountsAndDeviceId(
            blockchain,
            deviceModel,
            connectionType
        );

        const deviceId = accountsAndDeviceId.deviceId;
        accountsAndDeviceId.accounts[0].selected = true;

        const accounts = accountsAndDeviceId.accounts.map(v => {
            return { ...v, tokens: generateTokensConfig(blockchain) };
        });

        const wallet: IWallet = await HWWalletFactory.get(
            deviceVendor,
            deviceModel,
            deviceId,
            connectionType
        );
        const walletCredentials = await wallet.getWalletCredentials();

        const walletData: IWalletState = {
            id: walletId,
            walletPublicKey: undefined,
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

        if (walletCredentials) {
            try {
                await setWalletCredentialsKey(
                    walletCredentials.publicKey,
                    walletCredentials.privateKey
                );
                walletData.walletPublicKey = walletCredentials.publicKey;
            } catch {
                // already handled the error
            }
        }

        dispatch(addWallet(walletData));

        LedgerConnect.walletCreated(walletId);

        dispatch(setSelectedWallet(walletId));
        updateAddressMonitorTokens(getState().wallets);

        NavigationService.navigate('MainNavigation', {});
        NavigationService.navigate('Dashboard', {});

        dispatch(setDisplayPasswordModal(true));
        startNotificationsHandlers()(dispatch, getState);
    } catch (e) {
        dispatch(setDisplayPasswordModal(true));

        SentryCaptureException(new Error(JSON.stringify(e)));
        throw new Error(e);
    }
};

export const createHDWallet = (mnemonic: string, password: string, callback?: () => any) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    await LoadingModal.open();

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

            const walletCredentials = await wallet.getWalletCredentials();

            const walletData: IWalletState = {
                id: walletId,
                walletPublicKey: undefined,
                selected: false,
                selectedBlockchain: Blockchain.ZILLIQA, // by default the first blockchain is selected
                name: `Wallet ${Object.keys(getState().wallets).length + 1}`,
                type: WalletType.HD,
                accounts
            };

            if (walletCredentials) {
                try {
                    await setWalletCredentialsKey(
                        walletCredentials.publicKey,
                        walletCredentials.privateKey
                    );
                    walletData.walletPublicKey = walletCredentials.publicKey;
                } catch {
                    // already handled the error
                }
            }

            dispatch(addWallet(walletData));

            const encryptionKey = await getEncryptionKey(password);
            await storeEncrypted(mnemonic, walletId, encryptionKey);

            dispatch(setSelectedWallet(walletId));
            callback && callback();
            await LoadingModal.close();

            updateAddressMonitorTokens(getState().wallets);
            startNotificationsHandlers()(dispatch, getState);
        });
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));

        // TODO best way to handle this?
        await LoadingModal.close();
    }
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
    chainId: ChainIdType,
    broadcastedOnBlock: number,
    navigateToTransaction: boolean = false
) => async (dispatch, getState: () => IReduxState) => {
    const state = getState();
    const blockchainInstance = getBlockchain(blockchain);
    const client = blockchainInstance.getClient(chainId);
    const selectedAccount = getSelectedAccount(state);

    let transaction;

    try {
        transaction = await client.utils.getTransaction(transactionHash, {
            address: selectedAccount.address
        });
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

        if (navigateToTransaction) {
            const navigationParams: NavigationParams = {
                blockchain,
                accountIndex: transactionAccount.index,
                token: generateAccountTokenState(tokenConfig),
                tokenLogo: tokenConfig.icon,
                activeTab: blockchainInstance.config.ui?.token?.labels?.tabTransactions
            };

            dispatch(setSelectedWallet(wallet.id));
            NavigationService.navigate('Token', navigationParams);
        }
    }

    await LoadingModal.close();
};

export const sendTransferTransaction = (
    account: IAccountState,
    toAddress: string,
    amount: string,
    token: string,
    feeOptions: IFeeOptions,
    password: string,
    navigation: NavigationScreenProp<NavigationState>,
    extraFields: ITransactionExtraFields,
    goBack: boolean = true,
    sendResponse?: { requestId: string }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    const appWallet = getSelectedWallet(state);

    try {
        if (appWallet.type === WalletType.HD) {
            await LoadingModal.open({
                type: TransactionMessageType.INFO,
                text: TransactionMessageText.SIGNING
            });
        } else {
            await LedgerConnect.signTransaction(
                account.blockchain,
                appWallet.hwOptions?.deviceModel,
                appWallet.hwOptions?.connectionType
            );
        }

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

        const transaction = await wallet.sign(account.blockchain, account.index, tx);

        if (appWallet.type === WalletType.HD) {
            await LoadingModal.showMessage({
                text: TransactionMessageText.BROADCASTING,
                type: TransactionMessageType.INFO
            });
        }

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

            if (sendResponse) {
                await ConnectExtension.sendResponse(sendResponse.requestId, {
                    result: {
                        txHash,
                        tx
                    }
                });

                dispatch({ type: CLOSE_TX_REQUEST });
            }

            if (appWallet.type === WalletType.HD) {
                await LoadingModal.close();
            } else {
                await LedgerConnect.close();
            }
            dispatch(closeTransactionRequest());
            goBack && navigation.goBack();
            return;
        } else {
            throw new Error('GENERIC_ERROR');
        }
    } catch (errorMessage) {
        if (appWallet.type === WalletType.HD) {
            await LoadingModal.close();
        } else {
            await LedgerConnect.close();
        }

        const message =
            translate('LoadingModal.' + errorMessage, {
                app: account.blockchain,
                address: formatAddress(toAddress, account.blockchain)
            }) || translate('LoadingModal.GENERIC_ERROR');

        Dialog.info(translate('LoadingModal.txFailed'), message);
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

export const deleteAccount = (
    blockchain: Blockchain,
    accountId: string,
    accountIndex: number,
    password: string
) => async (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    const state = getState();
    const selectedWallet: IWalletState = getSelectedWallet(state);

    const hdWallet = await WalletFactory.get(selectedWallet.id, selectedWallet.type, {
        pass: password
    });

    const privateKey = hdWallet.getPrivateKey(blockchain, accountIndex);

    const chainId = getChainId(state, blockchain);
    const client = getBlockchain(blockchain).getClient(chainId) as NearClient;

    await client.deleteNearAccount(accountId, NEAR_ACCOUNT_EXTENSIONS[chainId], privateKey);
};

export const createNearAccount = (name: string, extension: string, password: string) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    await LoadingModal.open();

    const state = getState();
    const selectedWallet: IWalletState = getSelectedWallet(state);
    const hdWallet: IWallet = await WalletFactory.get(selectedWallet.id, selectedWallet.type, {
        pass: password
    });
    const blockchain = Blockchain.NEAR;

    const chainId = getChainId(state, blockchain);

    const accounts = await hdWallet.getAccounts(blockchain, 0);
    const account = accounts[0];

    const res = await new ApiClient().near.createAccount(
        name,
        extension,
        account.publicKey,
        String(chainId)
    );

    const newAccountId = `${name}.${extension}`;

    if (res?.result?.data?.status) {
        const tx = res.result.data;

        if (tx.status && tx.status?.SuccessValue === '') {
            let newAccountIndex = -1;

            for (const acc of selectedWallet.accounts) {
                if (acc.blockchain === Blockchain.NEAR && acc.index >= newAccountIndex) {
                    newAccountIndex = acc.index + 1;
                }
            }

            account.index = newAccountIndex === -1 ? 0 : newAccountIndex;
            account.address = newAccountId;
            account.tokens[chainId][getBlockchain(blockchain).config.coin].balance = {
                value: '0',
                inProgress: false,
                timestamp: undefined,
                error: undefined
            };
            dispatch(addAccount(selectedWallet.id, blockchain, account));
            dispatch(setSelectedAccount(account));

            NavigationService.navigate('Dashboard', {});
        } else if (tx.status && tx.status.Failure) {
            Dialog.info(
                translate('CreateNearAccount.failed'),
                translate('CreateNearAccount.tryAgain')
            );

            SentryAddBreadcrumb({ message: JSON.stringify(tx) });
            SentryCaptureException(
                new Error(
                    JSON.stringify({
                        errorMessage: `NEAR create account has failed, account id: ${newAccountId}`
                    })
                )
            );
        } else {
            Dialog.info(
                translate('CreateNearAccount.failed'),
                translate('CreateNearAccount.tryAgain')
            );

            SentryAddBreadcrumb({ message: JSON.stringify(tx) });
            SentryCaptureException(
                new Error(
                    JSON.stringify({
                        errorMessage: `NEAR create account has failed, account id: ${newAccountId}`
                    })
                )
            );
        }
    } else {
        Dialog.info(
            translate('CreateNearAccount.failed'),
            res?.message || res?.errorMessage || translate('CreateNearAccount.tryAgain')
        );

        SentryAddBreadcrumb({ message: JSON.stringify({ res, accountId: newAccountId }) });
        SentryCaptureException(
            new Error(
                JSON.stringify(
                    res?.message ||
                        res?.errorMessage ||
                        `NEAR create account has failed, account id: ${newAccountId}`
                )
            )
        );
    }

    await LoadingModal.close();
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

export const addPublishedTxToAccount = (
    txHash: string,
    tx: IBlockchainTransaction,
    walletId: string
) => (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    dispatch({
        type: TRANSACTION_PUBLISHED,
        data: {
            hash: txHash,
            tx,
            walletId
        }
    });
};

export const setWalletPublicKey = (walletId: string, walletPublicKey: string) => (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    dispatch({
        type: SET_WALLET_PUBLIC_KEY,
        data: { walletId, walletPublicKey }
    });
};

export const setWalletsCredentials = (password: string) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();

    for (const wallet of Object.values(state.wallets)) {
        try {
            if (wallet.walletPublicKey) {
                // credentials have been already set
                return;
            }

            let walletCredentials: { publicKey: string; privateKey: string };

            // Generate wallet credentials
            switch (wallet.type) {
                case WalletType.HD:
                    const storageHDWallet = await HDWallet.loadFromStorage(wallet.id, password);
                    walletCredentials = await storageHDWallet.getWalletCredentials();
                    break;

                case WalletType.HW:
                    const walletHW: IWallet = await HWWalletFactory.get(
                        wallet.hwOptions.deviceVendor,
                        wallet.hwOptions.deviceModel,
                        wallet.hwOptions.deviceId,
                        wallet.hwOptions.connectionType
                    );
                    walletCredentials = await walletHW.getWalletCredentials();
                    break;

                default:
                    break;
            }

            if (walletCredentials?.publicKey) {
                setWalletPublicKey(wallet.id, walletCredentials.publicKey)(dispatch, getState);

                const keychainWalletCredentials = await getWalletCredentialsKey(
                    walletCredentials.publicKey
                );

                if (!keychainWalletCredentials) {
                    await setWalletCredentialsKey(
                        walletCredentials.publicKey,
                        walletCredentials.privateKey
                    );
                }
            } else {
                throw new Error(
                    JSON.stringify({
                        walletPublicKey: wallet?.walletPublicKey,
                        walletType: wallet.type,
                        walletHwOptions: wallet?.hwOptions,
                        errorMessage: 'Undefined walletCredentials'
                    })
                );
            }
        } catch (err) {
            throw new Error(err);
        }
    }
};

export const getWalletAndAccountNameByAddress = (address: string) => (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
): { walletName: string; accountName: string } => {
    const state = getState();

    for (const wallet of Object.values(state.wallets)) {
        for (const account of wallet.accounts) {
            if (account.address?.toLocaleLowerCase() === address?.toLocaleLowerCase()) {
                return {
                    walletName: wallet.name,
                    accountName: account.name || `Account ${account.index + 1}`
                };
            }
        }
    }

    return undefined;
};
