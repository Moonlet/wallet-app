const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

export class HttpClient {
    private lastId: number = 0;
    constructor(private url: string) {}

    public async get(path: string): Promise<any> {
        return fetch(this.url + path).then(async res => {
            const response = await res.json();
            return response;
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

    public async jsonRpc(method: string, params?: any): Promise<any> {
        const id = this.lastId++;

        const body = {
            jsonrpc: '2.0',
            id,
            method,
            params: typeof params !== 'object' || params === null ? [params] : params
        };

        return this.post('', body).then(async res => {
            return res;
        });
    }
}
