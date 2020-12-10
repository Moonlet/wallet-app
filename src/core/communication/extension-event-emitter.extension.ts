import { bgPortRequest } from './bg-port';
import { browser } from 'webextension-polyfill-ts';
import { ConnectionPort, IExtensionMessage } from './extension';

const emit = async (event, data?) => {
    bgPortRequest({
        origin: 'Extension',
        controller: 'EventsController',
        method: 'emit',
        params: [{ event, data }]
    });
};

const onMessage = (cb): (() => void) => {
    const port = browser.runtime.connect('', { name: ConnectionPort.EVENTS });

    const listenerFn = (message: IExtensionMessage) => {
        if (typeof cb === 'function') {
            cb(message);
        } else {
            unsub();
        }
    };

    port.onMessage.addListener(listenerFn);
    const unsub = () => {
        port.onMessage.removeListener(listenerFn);
        port.disconnect();
    };

    return unsub;
};

export const ExtensionEventEmitter = { emit, onMessage };
