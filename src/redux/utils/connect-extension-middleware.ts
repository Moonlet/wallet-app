import { Platform } from 'react-native';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';
import { ConnectExtension } from '../../core/connect-extension/connect-extension';
import { captureException } from '@sentry/browser';

let timer;

export const connectExtensionMiddleware = () => next => async action => {
    next(action);

    timer && clearTimeout(timer);

    timer = setTimeout(async () => {
        if (Platform.OS !== 'web' && (await ConnectExtensionWeb.isConnected())) {
            try {
                const connection = await ConnectExtensionWeb.getConnection();

                if (connection) {
                    await ConnectExtension.syncExtension(connection);
                } else {
                    throw new Error('ConnectExtensionWeb.getConnection() returns a falsy value.');
                }
            } catch (e) {
                captureException(new Error(JSON.stringify(e)));
            }
        }
    }, 200);
};
