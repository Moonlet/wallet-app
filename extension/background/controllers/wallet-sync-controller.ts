import { IExtensionResponse } from '../../../src/core/communication/extension';
import { ConnectExtensionWeb } from '../../../src/core/connect-extension/connect-extension-web';
import { delay } from '../../../src/core/utils/time';

export class WalletSyncController {
    async extensionConnected(): Promise<IExtensionResponse> {
        await delay(3000);
        ConnectExtensionWeb.isConnected().then(res => {
            if (res) {
                ConnectExtensionWeb.listenLastSync(true);
            }
        });
        return {};
    }

    async extensionDisconnected(): Promise<IExtensionResponse> {
        await delay(3000);
        document.location.reload();
        return {};
    }
}
