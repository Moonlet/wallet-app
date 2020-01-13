import { HDWallet } from '../../core/wallet/hd-wallet/hd-wallet';
import { Blockchain } from '../../core/blockchain/types';
import { WalletType } from '../../core/wallet/types';
import { IWalletState, IAccountState } from './state';
import { IAction } from '../types';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { getChainId } from '../app/selectors';
import { appSwitchWallet, openBottomSheet, closeBottomSheet } from '../app/actions';
import uuidv4 from 'uuid/v4';
import { storeEncrypted, deleteFromStorage } from '../../core/secure/storage';
import { getBlockchain } from '../../core/blockchain/blockchain-factory';
import { WalletFactory } from '../../core/wallet/wallet-factory';
import { selectCurrentWallet } from './selectors';
import { HWVendor, HWModel, HWConnection } from '../../core/wallet/hw-wallet/types';
import {
    verifyAddressOnDevice,
    featureNotSupported,
    toInitialState,
    connectInProgress
} from '../screens/connectHardwareWallet/actions';
import { HWWalletFactory } from '../../core/wallet/hw-wallet/hw-wallet-factory';
import { NavigationScreenProp, NavigationState, NavigationActions } from 'react-navigation';
import { LedgerWallet } from '../../core/wallet/hw-wallet/ledger/ledger-wallet';
import { translate } from '../../core/i18n';
import { REVIEW_TRANSACTION } from '../screens/send/actions';
import { BottomSheetType } from '../app/state';

// actions consts
export const WALLET_ADD = 'WALLET_ADD';
export const WALLET_DELETE = 'WALLET_DELETE';
export const WALLET_CHANGE_NAME = 'WALLET_CHANGE_NAME';
export const ACCOUNT_GET_BALANCE = 'ACCOUNT_GET_BALANCE';
export const TRANSACTION_PUBLISHED = 'TRANSACTION_PUBLISHED';
export const ACCOUNT_ADD = 'ACCOUNT_ADD';
export const ACCOUNT_REMOVE = 'ACCOUNT_REMOVE';
import { REHYDRATE } from 'redux-persist';

// action creators
export const addWallet = (walletData: IWalletState) => {
    return {
        type: WALLET_ADD,
        data: walletData
    };
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
    blockchain: Blockchain,
    navigation: NavigationScreenProp<NavigationState>
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
        const walletData: IWalletState = {
            id: walletId,
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

        dispatch(appSwitchWallet(walletId));
        navigation.navigate(
            'MainNavigation',
            {},
            NavigationActions.navigate({ routeName: 'Dashboard' })
        );
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
            wallet.getAccounts(Blockchain.ZILLIQA, 1)
        ]).then(async data => {
            const walletId = uuidv4();
            const accounts: IAccountState[] = data.reduce((out, acc) => out.concat(acc), []);

            dispatch(
                addWallet({
                    id: walletId,
                    name: `Wallet ${Object.keys(getState().wallets).length + 1}`,
                    type: WalletType.HD,
                    accounts
                })
            );

            await storeEncrypted(mnemonic, walletId, password);

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
            const chainId = getChainId(state, account.blockchain);

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
    feeOptions: any,
    password: string,
    navigation: NavigationScreenProp<NavigationState>
) => async (dispatch, getState: () => IReduxState) => {
    const state = getState();
    const chainId = getChainId(state, account.blockchain);

    const appWallet = selectCurrentWallet(state);

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

        const options = {
            nonce,
            chainId,
            gasPrice: feeOptions.gasPrice,
            gasLimit: feeOptions.gasLimit,
            publicKey: account.publicKey
        };

        const tx = {
            from: account.address,
            to: toAddress,
            amount: blockchainInstance.account.amountToStd(amount),
            options
        };

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

        const publish = await getBlockchain(account.blockchain)
            .getClient(chainId)
            .sendTransaction(transaction);
        if (publish) {
            dispatch({
                type: TRANSACTION_PUBLISHED,
                data: {
                    hash: transaction,
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
                navigation.goBack();
            }

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
    if (state.app.currentWalletId === walletId) {
        const nextWallet = Object.values(state.wallets).find(wallet => wallet.id !== walletId);
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
