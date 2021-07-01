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
        } catch (err) {
            SentryAddBreadcrumb({
                message: JSON.stringify({
                    keys
                })
            });

            SentryCaptureException(new Error(JSON.stringify(err)));
            return err;
        }
    }
}
