import { browser, Runtime } from 'webextension-polyfill-ts';
import {
    IExtensionResponse,
    ConnectionPort,
    IExtensionMessage
} from '../../src/core/communication/extension';
import { Controllers } from './controllers';
import { store } from '../../src/redux/config';
import { ConnectExtensionWeb } from '../../src/core/connect-extension/connect-extension-web';

// initialize store
store.dispatch({
    type: 'dummy'
});
ConnectExtensionWeb.isConnected().then(res => {
    if (res) {
        ConnectExtensionWeb.listenLastSync();
    }
});

// init controllers
Controllers.init();
const controllers = Controllers.get();

const generateResponse = (message: IExtensionMessage, response: IExtensionResponse) => {
    return { ...message, type: 'RESPONSE', response };
};

// create communication port
browser.runtime.onConnect.addListener((port: Runtime.Port) => {
    if (port.name === ConnectionPort.BACKGROUND) {
        // const connectionId = uuid();

        let portDisconnected = false;
        port.onDisconnect.addListener(() => {
            portDisconnected = true;
        });

        port.onMessage.addListener(async (message: IExtensionMessage) => {
            // TODO https check (only for production)
            // TODO default port check (only for production)
            try {
                if (
                    message.id &&
                    message.type === 'REQUEST' &&
                    message.request &&
                    message.request.method[0] !== '_' &&
                    controllers[message.request.controller] &&
                    typeof controllers[message.request.controller][message.request.method] ===
                        'function'
                ) {
                    const response = await controllers[message.request.controller][
                        message.request.method
                    ](port.sender, message.request);
                    if (!portDisconnected) {
                        port.postMessage(generateResponse(message, response));
                        // console.log('bg port', 'response', response);
                    }
                } else {
                    if (!portDisconnected) {
                        port.postMessage(generateResponse(message, { error: 'INVALID_REQUEST' }));
                    }
                }
            } catch (error) {
                if (!portDisconnected) {
                    port.postMessage(
                        generateResponse(message, { error: 'GENERIC_ERROR', data: error })
                    );
                }
            }
        });
    }
});
