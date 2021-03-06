process.env.CONTEXT = 'extension-background';

import { store } from '../../src/redux/config';
import { wrapStore } from 'webext-redux';

import firebase from 'firebase/app';
import CONFIG from '../../src/config';

import { Controllers } from './controllers';
import {
    ConnectionPort,
    IExtensionMessage,
    IExtensionResponse
} from '../../src/core/communication/extension';
import { browser, Runtime } from 'webextension-polyfill-ts';
import { PubSub } from './utils/pub-sub';

// initialize store
firebase.initializeApp(CONFIG.firebaseWebConfig);

// wrap store
wrapStore(store, {
    portName: 'moonlet-extension-store-port'
});

// init controllers
Controllers.init();
const controllers = Controllers.get();

// trigger firebase sync
controllers.WalletSyncController.extensionConnected();

const generateResponse = (
    message: IExtensionMessage,
    response: IExtensionResponse
): IExtensionMessage => {
    return { ...message, type: 'RESPONSE', response };
};

const handleMessage = async (
    sender,
    message: IExtensionMessage,
    sendResponse?: (response: IExtensionMessage) => any
) => {
    let response;
    try {
        if (
            message.id &&
            message.type === 'REQUEST' &&
            message.request &&
            message.request.method[0] !== '_' &&
            controllers[message.request.controller] &&
            typeof controllers[message.request.controller][message.request.method] === 'function'
        ) {
            const responseData = await controllers[message.request.controller][
                message.request.method
            ](sender, message.request);

            response = generateResponse(message, responseData);
        } else {
            response = generateResponse(message, { error: 'INVALID_REQUEST' });
        }
    } catch (error) {
        response = generateResponse(message, { error: 'GENERIC_ERROR', data: error });
    }

    typeof sendResponse === 'function' && sendResponse(response);
    return response;
};

// create communication port
const eventEmitter = PubSub();
browser.runtime.onConnect.addListener((port: Runtime.Port) => {
    if (port.name === ConnectionPort.BACKGROUND) {
        // const connectionId = uuid();

        let portDisconnected = false;
        port.onDisconnect.addListener(() => {
            portDisconnected = true;
        });

        port.onMessage.addListener(async (message: IExtensionMessage) => {
            // TODO https check (only for production)
            // TODO blacklist check (message sender (origin), and sender tab url (parent))
            // TODO whitelist check for message origin (api.moonlet.io) -> to be sure the message was sent through our iframe
            if (
                message.id &&
                message.type === 'REQUEST' &&
                message.request &&
                message.request.controller === 'EventsController' &&
                message.request.method === 'emit'
            ) {
                const event: IExtensionMessage = {
                    id: message.id,
                    type: 'EVENT',
                    response: {
                        data: message.request.params[0]
                    }
                };
                eventEmitter.emit('extensionEvent', event);
            } else {
                handleMessage(port.sender, message, (response: IExtensionMessage) => {
                    if (!portDisconnected) {
                        port.postMessage(response);
                    }
                });
            }
        });
    } else if (port.name === ConnectionPort.EVENTS) {
        let portDisconnected = false;

        const unsub = eventEmitter.subscribe('extensionEvent', (message: IExtensionMessage) => {
            if (!portDisconnected) {
                port.postMessage(message);
            }
        });

        port.onDisconnect.addListener(() => {
            portDisconnected = true;
            unsub();
        });
    }
});
