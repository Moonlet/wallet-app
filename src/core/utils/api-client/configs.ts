import { ApiClient } from './api-client';
import { captureException as SentryCaptureException } from '@sentry/react-native';

export class ConfigsApiClient {
    constructor(private apiClient: ApiClient) {}

    public async getConfigs(keys: string[]) {
        try {
            return this.apiClient.http.post('/configs', {
                keys
            });
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
            return err;
        }
    }
}
