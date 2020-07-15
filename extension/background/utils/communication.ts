import { Runtime } from 'webextension-polyfill-ts';

export const getSenderDomain = (sender: Runtime.MessageSender) => {
    try {
        const url = new URL(sender.tab.url);
        return url.hostname;
    } catch {
        return undefined;
    }
};
