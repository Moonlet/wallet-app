import { browser } from 'webextension-polyfill-ts';
import {
    ConnectionPort,
    IExtensionRequest,
    IExtensionMessage,
    IExtensionResponse
} from './extension';
import uuid from 'uuid/v4';

const bgPort = browser.runtime.connect('', { name: ConnectionPort.BACKGROUND });

export const getBgPort = () => {
    return bgPort;
};

export const bgPortRequest = (request: IExtensionRequest): Promise<IExtensionResponse> => {
    return new Promise((resolve, reject) => {
        const reqMessage: IExtensionMessage = {
            id: uuid(),
            target: 'MOONLET_EXTENSION',
            type: 'REQUEST',
            request
        };

        // subscrbe for response from bg script
        const onMessage = (resMessage: IExtensionMessage) => {
            if (resMessage.type === 'RESPONSE' && resMessage.id === reqMessage.id) {
                resolve(resMessage.response);
                bgPort.onMessage.removeListener(onMessage);
                bgPort.onDisconnect.removeListener(onDisconnect);
            }
        };

        const onDisconnect = () => {
            reject('CONNECTION_LOST');
            bgPort.onMessage.removeListener(onMessage);
            bgPort.onDisconnect.removeListener(onDisconnect);
        };

        bgPort.onMessage.addListener(onMessage);
        bgPort.onDisconnect.addListener(onDisconnect);

        // send request message to bg script
        bgPort.postMessage(reqMessage);
    });
};
