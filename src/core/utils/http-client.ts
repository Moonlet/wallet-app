import { delay } from './time';
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
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
                SentryAddBreadcrumb({ message: JSON.stringify(response.headers) });
                SentryAddBreadcrumb({ message: JSON.stringify(response.statusText) });
                SentryCaptureException(
                    new Error(`GET request failed to ${url} with ${response.status}`),
                    {
                        tags: {
                            url,
                            status: response.status
                        }
                    }
                );
            }

            return response.json();
        } catch (error) {
            // Sentry
            SentryAddBreadcrumb({ message: JSON.stringify(error) });
            SentryCaptureException(
                new Error(`GET request failed to ${url} with ${error?.message}`),
                {
                    tags: {
                        url
                    }
                }
            );

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
                SentryAddBreadcrumb({ message: JSON.stringify(response.headers) });
                SentryAddBreadcrumb({ message: JSON.stringify(response.statusText) });
                SentryCaptureException(
                    new Error(`POST request failed to ${url} with ${response.status}`),
                    {
                        tags: {
                            url,
                            status: response.status
                        }
                    }
                );
            }

            return response.json();
        } catch (error) {
            // Sentry
            SentryAddBreadcrumb({ message: JSON.stringify(error) }); // error
            SentryAddBreadcrumb({ message: JSON.stringify(body) }); // body
            SentryCaptureException(
                new Error(`POST request failed to ${url} with ${error?.message}`),
                {
                    tags: {
                        url
                    }
                }
            );

            return Promise.reject(error);
        }
    }

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

            if (res.status === 200) {
                return await res.json(); // added await intentionally, to fail if json is invalid, so it will retry
            } else if (retries > 0) {
                // Sentry
                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        headers: res.headers
                    })
                });
                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        statusText: res.statusText,
                        method,
                        params: JSON.stringify(params),
                        retries
                    })
                });
                SentryCaptureException(
                    new Error(`JsonRpc request failed to ${res.url} with ${res.status}`),
                    {
                        tags: {
                            url: res.url,
                            status: res.status
                        }
                    }
                );

                await delay(500);
                return this.jsonRpc(method, params, retries - 1);
            } else {
                // Sentry
                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        headers: res.headers
                    })
                });
                SentryAddBreadcrumb({
                    message: JSON.stringify({
                        statusText: res.statusText,
                        method,
                        params: JSON.stringify(params),
                        retries
                    })
                });
                SentryCaptureException(
                    new Error(`JsonRpc request failed to ${res.url} with ${res.status}`),
                    {
                        tags: {
                            url: res.url,
                            status: res.status
                        }
                    }
                );

                return res.json();
            }
        } catch (error) {
            // Sentry
            SentryAddBreadcrumb({ message: JSON.stringify(error) });
            SentryCaptureException(new Error(`JsonRpc request failed with ${error.message}`), {
                tags: {
                    method,
                    params: JSON.stringify(params),
                    retries
                }
            });

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
