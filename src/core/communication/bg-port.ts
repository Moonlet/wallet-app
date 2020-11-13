import { IExtensionRequest, IExtensionResponse } from './extension';

export const getBgPort = (): any => {
    throw new Error('NOT_IMPLEMENTED');
};

export const bgPortRequest = (request: IExtensionRequest): Promise<IExtensionResponse> => {
    return Promise.reject('NOT_IMPLEMENTED');
};
