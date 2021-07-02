import { ApiClient } from './api-client';
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
} from '@sentry/react-native';

export class ConfigsApiClient {
    constructor(private apiClient: ApiClient) {}

    public async getConfigs(keys: string[]) {
        try {
            return this.apiClient.http.post('/configs', {
                keys
            });
        } catch (error) {
            SentryAddBreadcrumb({
                message: JSON.stringify({
                    data: {
                        keys
                    },
                    error
                })
            });

            SentryCaptureException(new Error(`Cannot get api configs, ${error?.message}`));

            return error;
        }
    }
}
