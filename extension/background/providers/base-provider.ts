import { Runtime } from 'webextension-polyfill-ts';
import { IExtensionRequest } from '../../../src/core/communication/extension';

export abstract class BaseProvider {
    abstract async rpc(sender: Runtime.MessageSender, request: IExtensionRequest): Promise<any>;
}
