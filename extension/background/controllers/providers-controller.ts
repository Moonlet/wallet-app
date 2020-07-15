import { IExtensionResponse, IExtensionRequest } from '../../../src/core/communication/extension';
import { getPorvider } from '../providers/provider-factory';

export class ProvidersController {
    async rpc(sender, request: IExtensionRequest): Promise<IExtensionResponse> {
        try {
            const response = await getPorvider(request.blockchain).rpc(
                request.params[0].method,
                request.params[0].params
            );
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
