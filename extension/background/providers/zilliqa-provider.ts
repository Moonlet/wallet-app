import { BaseProvider } from './base-provider';
import { HttpClient } from '../../../src/core/utils/http-client';
import { networks } from '../../../src/core/blockchain/zilliqa/networks';
import uuid from 'uuid/v4';
import { setRequest, onResponse } from '../utils/screen-data';
import { Blockchain } from '../../../src/core/blockchain/types';
import { IExtensionResponse } from '../../../src/core/communication/extension';
import { browser } from 'webextension-polyfill-ts';

export class ZilliqaProvider extends BaseProvider {
    rpc(method: string, params: any[]): Promise<any> {
        switch (method) {
            case 'CreateTransaction':
            case 'SignMessage':
                return new Promise(async resolve => {
                    const id = uuid();
                    const unsub = onResponse(id, (response: IExtensionResponse) => {
                        resolve(response.data);
                        unsub();
                        browser.windows.onRemoved.removeListener(onWindowClose);
                    });

                    setRequest(id, {
                        controller: undefined,
                        method,
                        blockchain: Blockchain.ZILLIQA,
                        params
                    });

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
                break;
            default:
                // just do a http call
                // todo update chain id
                const httpClient = new HttpClient(networks[0].url);
                return httpClient.jsonRpc(method, params);
        }
    }
}
