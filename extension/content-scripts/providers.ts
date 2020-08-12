// create communication port with bg script
import { browser } from 'webextension-polyfill-ts';
import { IExtensionMessage, IExtensionRequest } from '../../src/core/communication/extension';
import { bgPortRequest } from '../../src/core/communication/bg-port';

browser.runtime.sendMessage('TEST');

const methodsWhitelist: RegExp[] = [
    // /^Controller\.(?!method2$|method$)/gi // example of negation, all methods from Controller beside method2 and method are allowed
    /^ProvidersController\.rpc$/gi
];

const isRequestAllowed = (request: IExtensionRequest) => {
    const method = `${request.controller}.${request.method}`;
    for (const rule of methodsWhitelist) {
        if (method?.match(rule)) {
            return true;
        }
    }
    return false;
};

const sendMessage = (message: IExtensionMessage, target: string) => {
    try {
        window.parent.window.postMessage(message, target);
    } catch {
        try {
            window.top.window.postMessage(message, target);
        } catch {
            try {
                window.opener.window.postMessage(message, target);
            } catch {
                window.postMessage(message, target);
            }
        }
    }
};

window.onmessage = async (event: MessageEvent) => {
    const message = event?.data as IExtensionMessage;
    // listen for messages from top frame (we are in an iframe, bridge iframe)
    // listen only for messages with target MOONLET_EXTENSION and type REQUEST
    // other messages are ignored
    if (
        event.source === window.parent &&
        message.target === 'MOONLET_EXTENSION' &&
        message.type === 'REQUEST'
    ) {
        // message received from dapp
        // forward it to bg script

        if (message.id && message?.request?.controller && message?.request?.method) {
            if (isRequestAllowed(message.request)) {
                const responseMessage = await bgPortRequest({
                    ...message.request,
                    origin: event.origin
                });
                sendMessage(
                    {
                        ...message,
                        type: 'RESPONSE',
                        response: responseMessage
                    },
                    event.origin
                );
            } else {
                const responseMessage: IExtensionMessage = {
                    ...message,
                    type: 'RESPONSE',
                    response: {
                        error: 'ACCESS_UNAUTHORIZED',
                        message: `${message.request.controller}.${message.request.method} cannot be called from an external source.`
                    }
                };
                sendMessage(responseMessage, event.origin);
            }
        } else {
            const responseMessage: IExtensionMessage = {
                ...message,
                type: 'RESPONSE',
                response: {
                    error: 'INVALID_REQUEST',
                    message: 'Request is not in the right format.'
                }
            };
            sendMessage(responseMessage, event.origin);
        }
    }
};
