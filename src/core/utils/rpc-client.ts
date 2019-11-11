const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

export class RpcClient {
    private lastId: number = 0;
    constructor(private url: string) {}

    public call(method: string, params: any[] = []): Promise<any> {
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

        // console.log("RPC client", 'request', request);
        return fetch(this.url, request).then(async res => {
            const response = await res.json();
            // console.log("RPC client", 'response', response);
            return response;
        });
    }
}
