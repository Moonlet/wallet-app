import { delay } from './time';

const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

export class HttpClient {
    private lastId: number = 0;

    public jsonRpcRetriesFailedRequests = 0; // if >0 it will retry requests with status code != 200

    constructor(private url: string) {}

    public async get(path: string): Promise<any> {
        return fetch(this.url + path).then(async res => {
            const response = await res.json();
            return response;
        });
    }

    public async rawPost(path: string, body): Promise<Response> {
        return fetch(this.url + path, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(body)
        });
    }

    public async post(path: string, body: {}): Promise<any> {
        return fetch(this.url + path, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(body)
        }).then(response => {
            return response.json();
        });
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
                return res.json();
            } else if (retries > 0) {
                await delay(500);
                return this.jsonRpc(method, params, retries - 1);
            } else {
                return res.json();
            }
        } catch (e) {
            return resPromise.then(response => {
                return response.json();
            });
        }
    }
}
