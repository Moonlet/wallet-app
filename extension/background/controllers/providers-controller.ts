import { IExtensionResponse, IExtensionRequest } from '../../../src/core/communication/extension';
import { getPorvider } from '../providers/provider-factory';
import { Runtime } from 'webextension-polyfill-ts';

export class ProvidersController {
    async rpc(
        sender: Runtime.MessageSender,
        request: IExtensionRequest
    ): Promise<IExtensionResponse> {
        try {
            const response = await getPorvider(request.blockchain).rpc(sender, request);
            return {
                data: response
            };
        } catch (e) {
            return {
                error: e.code || 'ERROR',
                data: e
            };
        }
    }
}
