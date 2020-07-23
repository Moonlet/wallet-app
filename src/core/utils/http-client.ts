import axios from 'axios';

const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

export class HttpClient {
    private lastId: number = 0;
    constructor(private url: string) {}

    public async get(path: string): Promise<any> {
        const response = await axios.get(this.url + path);
        return response;
    }

    public async post(path: string, body: {}): Promise<any> {
        const response = await axios.post(this.url + path, body, {
            headers: defaultHeaders
        });
        return response.data;
    }

    public async jsonRpc(method: string, params: any[] = []): Promise<any> {
        if (this.lastId >= 100000) this.lastId = 0;

        const body = {
            jsonrpc: '2.0',
            id: this.lastId++,
            method,
            params: Array.isArray(params) ? params : [params]
        };

        const response = await this.post('', body);
        return response;
    }
}
