import { IExtensionRequest, IExtensionResponse } from '../../../src/core/communication/extension';
import { PubSub } from './pub-sub';

const screens: {
    [id: string]: {
        request: IExtensionRequest;
    };
} = {};

const pubSub = PubSub();

export const setRequest = (id: string, request: IExtensionRequest) => {
    screens[id] = {
        request
    };
};

export const getRequest = (id: string): IExtensionRequest => {
    return screens[id]?.request;
};

export const setResponse = (id: string, response: IExtensionResponse): boolean => {
    if (screens[id]) {
        pubSub.emit(id, response);
        delete screens[id];
    }
    return true;
};

export const onResponse = (
    id: string,
    callback: (response: IExtensionResponse) => any
): (() => any) => {
    return pubSub.subscribe(id, callback);
};
