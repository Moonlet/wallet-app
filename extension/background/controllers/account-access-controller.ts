import { IExtensionResponse, IExtensionRequest } from '../../../src/core/communication/extension';
import {
    getAccessSettings,
    resetAccessSettings,
    allowAccess,
    declineAccess,
    getDomainAccounts,
    switchAccount
} from '../utils/account-access';
import { Runtime } from 'webextension-polyfill-ts';

export class AccountAccessController {
    constructor() {
        getAccessSettings();
    }

    private async invoke(fn: () => Promise<any>) {
        try {
            return {
                data: await fn()
            };
        } catch (e) {
            return {
                error: 'ERROR',
                message: e.message,
                data: e
            };
        }
    }

    allowAccess(
        sender: Runtime.MessageSender,
        request: IExtensionRequest
    ): Promise<IExtensionResponse> {
        return this.invoke(() => allowAccess(request.params[0], request.params[1]));
    }

    declineAccess(
        sender: Runtime.MessageSender,
        request: IExtensionRequest
    ): Promise<IExtensionResponse> {
        return this.invoke(() => declineAccess(request.params[0], request.params[1]));
    }

    getAccessSettings(
        sender: Runtime.MessageSender,
        request: IExtensionRequest
    ): Promise<IExtensionResponse> {
        return this.invoke(getAccessSettings);
    }

    reset(sender: Runtime.MessageSender, request: IExtensionRequest): Promise<IExtensionResponse> {
        return this.invoke(resetAccessSettings);
    }

    getDomainAccounts(
        sender: Runtime.MessageSender,
        request: IExtensionRequest
    ): Promise<IExtensionResponse> {
        return this.invoke(() => getDomainAccounts(request.params[0], request.params[1]));
    }

    switchAccount(
        sender: Runtime.MessageSender,
        request: IExtensionRequest
    ): Promise<IExtensionResponse> {
        return this.invoke(() =>
            switchAccount(request.params[0], request.params[1], request.params[2])
        );
    }
}
