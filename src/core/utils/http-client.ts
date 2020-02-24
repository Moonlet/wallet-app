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

    public post(path: string, body: string): Promise<any> {
        // console.log('RPC client', 'request', request);
        return fetch(this.url + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(response => {
            return response.json();
        });
    }

    public rpcCall(method: string, params: any[] = []): Promise<any> {
        const id = this.lastId++;
        const request = {
            method: 'POST',
            headers: defaultHeaders,
            body: JSON.stringify({
                jsonrpc: '2.0',
                id,
                method,
                params: Array.isArray(params) ? params : [params]
            })
        };

        // console.log('RPC client', 'request', request);
        return fetch(this.url, request).then(async res => {
            const response = await res.json();
            return response;
        });
    }
}
