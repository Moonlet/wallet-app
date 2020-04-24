const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

export class HttpClient {
    private lastId: number = 0;
    constructor(private url: string) {}

    public get(path: string): Promise<any> {
        // console.log('RPC client', 'request', request);
        return fetch(this.url + path).then(async res => {
            const response = await res.json();
            //  console.log('RPC client', 'response', response);
            return response;
        });
    }

    public post(path: string, body: {}): Promise<any> {
        return fetch(this.url + path, {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify(body)
        }).then(response => {
            return response.json();
        });
    }

    public jsonRpc(method: string, params: any[] = []): Promise<any> {
        const id = this.lastId++;
        const body = {
            jsonrpc: '2.0',
            id,
            method,
            params: Array.isArray(params) ? params : [params]
        };

        return this.post('', body).then(async res => {
            //            console.log('response', res, this.url);
            return res;
        });
    }
}
