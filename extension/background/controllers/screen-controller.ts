import { IExtensionRequest, IExtensionResponse } from '../../../src/core/communication/extension';
import { Runtime } from 'webextension-polyfill-ts';
import { getRequest, setResponse } from '../utils/screen-data';

export class ScreenController {
    async getRequest(
        sender: Runtime.MessageSender,
        request: IExtensionRequest
    ): Promise<IExtensionResponse> {
        return {
            data: getRequest(request.params[0])
        };
    }

    async setResponse(
        sender: Runtime.MessageSender,
        request: IExtensionRequest
    ): Promise<IExtensionResponse> {
        return {
            data: setResponse(request.params[0], request.params[1])
        };
    }
}
