import { BaseProvider } from './base-provider';
import { HttpClient } from '../../../src/core/utils/http-client';
import { networks } from '../../../src/core/blockchain/zilliqa/networks';
import uuid from 'uuid/v4';
import { setRequest, onResponse } from '../utils/screen-data';
import { Blockchain } from '../../../src/core/blockchain/types';
import { IExtensionResponse, IExtensionRequest } from '../../../src/core/communication/extension';
import { browser, Runtime } from 'webextension-polyfill-ts';
import { getChainId } from '../../../src/redux/preferences/selectors';
import { store } from '../../../src/redux/config';
import {
    getDomainAccounts,
    allowAccess,
    declineAccess,
    getAccountInfo
} from '../utils/account-access';
// import { hasAccess } from '../utils/account-access';

export class ZilliqaProvider extends BaseProvider {
    _openConfirmationScreen(request: IExtensionRequest): Promise<any> {
        return new Promise(async resolve => {
            const id = uuid();
            const unsub = onResponse(id, (response: IExtensionResponse) => {
                resolve(response.data);
                unsub();
                browser.windows.onRemoved.removeListener(onWindowClose);
            });

            setRequest(id, request);

            // open confirmation window
            const window = await browser.windows.create({
                url: `/index.html#${id}`,
                type: 'popup',
                width: 350,
                height: 605
            });

            // handle window close
            const onWindowClose = windowId => {
                // console.log('window closed', windowId);
                if (windowId === window.id) {
                    // console.log(id, 'window closed');
                    browser.windows.onRemoved.removeListener(onWindowClose);
                    const errorResponse: any = {
                        jsonrpc: '2.0',
                        error: {
                            code: -1,
                            message: 'CANCELED_BY_USER: Operation cancelled by user'
                        }
                    };
                    if (request.params[0]?.id) {
                        errorResponse.id = id;
                    }
                    resolve(errorResponse);
                }
            };
            browser.windows.onRemoved.addListener(onWindowClose);
        }).then((response: any) => {
            const chainId = getChainId(store.getState(), Blockchain.ZILLIQA);
            const network = networks.find(n => n.chainId === chainId);
            return {
                ...response,
                req: {
                    url: network.url,
                    payload: request.params[0]
                }
            };
        });
    }

    async rpc(sender: Runtime.MessageSender, request: IExtensionRequest): Promise<any> {
        // TODO: check if sender has acess to the account that makes the request.

        const rpcRequest = request.params[0];
        let availableAccounts;
        let address;
        let accountInfo;

        if (request.blockchain && !request.chainId) {
            const chainId = getChainId(store.getState(), request.blockchain);
            request.chainId = chainId;
        }

        switch (rpcRequest?.method) {
            case 'GetAccount':
                if (rpcRequest?.params[0]) {
                    return this._openConfirmationScreen(request).then(async res => {
                        if (!res.error) {
                            await declineAccess(request.origin);
                            await allowAccess(request.origin, res.result);
                            const acc = await getDomainAccounts(request.origin, Blockchain.ZILLIQA);
                            res.result = acc[0].address;
                        }

                        return res;
                    });
                }

                const accounts = await getDomainAccounts(request.origin, Blockchain.ZILLIQA);
                if (Array.isArray(accounts) && accounts.length > 0) {
                    return {
                        id: rpcRequest.id || 0,
                        jsonrpc: '2.0',
                        result: accounts[0].address
                    };
                }
                return this._openConfirmationScreen(request).then(async res => {
                    if (!res.error) {
                        await declineAccess(request.origin);
                        await allowAccess(request.origin, res.result);
                        const acc = await getDomainAccounts(request.origin, Blockchain.ZILLIQA);
                        res.result = acc[0].address;
                    }
                    return res;
                });
            case 'CreateTransaction':
                // TODO: check permissions
                availableAccounts = await getDomainAccounts(request.origin, Blockchain.ZILLIQA);
                address = rpcRequest.params[0]?.fromAddr || availableAccounts[0]?.address;
                accountInfo = await getAccountInfo(request.origin, request.blockchain, address);
                if (accountInfo) {
                    rpcRequest.params[0].fromAddr = address;
                    request.walletPubKey = accountInfo.walletPubKey;
                    return this._openConfirmationScreen(request);
                } else {
                    return {
                        jsonrpc: '2.0',
                        error: {
                            code: -1,
                            message: `ACCESS_UNAUTHORIZED: User did not authorize ${address ||
                                'any'} address for ${request.origin}`
                        }
                    };
                }
            case 'SignMessage':
                // TODO: check permissions
                availableAccounts = await getDomainAccounts(request.origin, Blockchain.ZILLIQA);
                address = rpcRequest.params[0] || availableAccounts[0]?.address;
                accountInfo = await getAccountInfo(request.origin, request.blockchain, address);
                if (accountInfo) {
                    rpcRequest.params[0] = address;
                    request.walletPubKey = accountInfo.walletPubKey;
                    return this._openConfirmationScreen(request);
                } else {
                    return {
                        jsonrpc: '2.0',
                        error: {
                            code: -1,
                            message: `ACCESS_UNAUTHORIZED: User did not authorize ${address ||
                                'any'} address for ${request.origin}`
                        }
                    };
                }
            default:
                // just do a http call
                const chainId = getChainId(store.getState(), Blockchain.ZILLIQA);
                const network = networks.find(n => n.chainId === chainId);

                const httpClient = new HttpClient(network.url);
                return httpClient
                    .jsonRpc(rpcRequest.method, rpcRequest?.params || [])
                    .then(response => {
                        return {
                            ...response,
                            req: {
                                url: network.url,
                                payload: rpcRequest
                            }
                        };
                    });
        }
    }
}
