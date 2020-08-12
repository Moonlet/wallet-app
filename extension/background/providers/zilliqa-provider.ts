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
                    resolve({
                        error: 'CANCELED'
                    });
                }
            };
            browser.windows.onRemoved.addListener(onWindowClose);
        });
    }

    rpc(sender: Runtime.MessageSender, request: IExtensionRequest): Promise<any> {
        // TODO: check if sender has acess to the account that makes the request.

        const rpcRequest = request.params[0];
        switch (rpcRequest?.method) {
            case 'GetAccounts':
                return this._openConfirmationScreen(request);
            case 'CreateTransaction':
                // TODO: check permissions
                return this._openConfirmationScreen(request);
            case 'SignMessage':
                // TODO: check permissions
                return this._openConfirmationScreen(request);
            default:
                // just do a http call
                const chainId = getChainId(store.getState(), Blockchain.ZILLIQA);
                const network = networks.find(n => n.chainId === chainId);

                const httpClient = new HttpClient(network.url);
                return httpClient.jsonRpc(request.method, request.params);
        }
    }
}
