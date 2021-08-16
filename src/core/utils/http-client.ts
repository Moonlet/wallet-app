import { delay } from './time';
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException,
    setTags as SentrySetTags
} from '@sentry/react-native';

const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

export class HttpClient {
    private lastId: number = 0;

    public jsonRpcRetriesFailedRequests = 0; // if >0 it will retry requests with status code != 200

    constructor(private url: string) {}

    public async get(path: string): Promise<any> {
        const url = this.url + path;

        try {
            const response = await fetch(url);

            if (response.status !== 200) {
                // Sentry
                SentrySetTags({ url, status: response.status });
                SentryAddBreadcrumb({ message: JSON.stringify(response.headers) });
                SentryAddBreadcrumb({ message: JSON.stringify(response.statusText) });
                SentryCaptureException(`GET request failed to ${url} with ${response.status}`);
            }

            return response.json();
        } catch (error) {
            // Sentry
            SentrySetTags({ url });
            SentryAddBreadcrumb({ message: JSON.stringify(error) });
            SentryCaptureException(`GET request failed to ${url} with ${error?.message}`);

            return Promise.reject(error);
        }
    }

    public async rawPost(path: string, body: {}): Promise<Response> {
        return fetch(this.url + path, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(body)
        });
    }

    public async post(path: string, body: {}): Promise<any> {
        const url = this.url + path;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: defaultHeaders,
                body: JSON.stringify(body)
            });

            if (response.status !== 200) {
                // Sentry
                SentrySetTags({ url, status: response.status });
                SentryAddBreadcrumb({ message: JSON.stringify(response.headers) });
                SentryAddBreadcrumb({ message: JSON.stringify(response.statusText) });
                SentryCaptureException(`POST request failed to ${url} with ${response.status}`);
            }

            return response.json();
        } catch (error) {
            // Sentry
            SentrySetTags({ url });
            SentryAddBreadcrumb({ message: JSON.stringify(error) }); // error
            SentryAddBreadcrumb({ message: JSON.stringify(body) }); // body
            SentryCaptureException(`POST request failed to ${url} with ${error?.message}`);

            return Promise.reject(error);
        }
    }

    // Request to failed with status code

    public async jsonRpc(
        method: string,
        params: any = [],
        retries = this.jsonRpcRetriesFailedRequests
    ): Promise<any> {
        const id = this.lastId++;
        const body = {
            jsonrpc: '2.0',
            id,
            method,
            params: typeof params !== 'object' || params === null ? [params] : params
        };

        const resPromise = this.rawPost('', body);

        try {
            const res = await resPromise;

            const sentryTags = {
                url: res.url,
                status: res.status,
                method,
                params: JSON.stringify(params),
                retries
            };

            if (res.status === 200) {
                return await res.json(); // added await intentionally, to fail if json is invalid, so it will retry
            } else if (retries > 0) {
                // Sentry
                SentrySetTags(sentryTags);
                SentryAddBreadcrumb({ message: JSON.stringify(res.headers) });
                SentryAddBreadcrumb({ message: JSON.stringify(res.statusText) });
                SentryCaptureException(`JsonRpc request failed to ${res.url} with ${res.status}`);

                await delay(500);
                return this.jsonRpc(method, params, retries - 1);
            } else {
                // Sentry
                SentrySetTags(sentryTags);
                SentryAddBreadcrumb({ message: JSON.stringify(res.headers) });
                SentryAddBreadcrumb({ message: JSON.stringify(res.statusText) });
                SentryCaptureException(`JsonRpc request failed to ${res.url} with ${res.status}`);

                return res.json();
            }
        } catch (error) {
            // Sentry
            SentrySetTags({ method, params: JSON.stringify(params), retries });
            SentryAddBreadcrumb({ message: JSON.stringify(error) });
            SentryCaptureException(`JsonRpc request failed with ${error.message}`);

            if (retries > 0) {
                await delay(500);
                return this.jsonRpc(method, params, retries - 1);
            } else {
                return resPromise.then(response => {
                    return response.json();
                });
            }
        }
    }
}
