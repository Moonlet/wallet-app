export class HttpClientWeb {
    /*
     *  GET
     */
    public async get(url: string, responseType?: XMLHttpRequestResponseType): Promise<any> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            if (responseType) {
                xhr.responseType = responseType;
            }
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.status);
                }
            };
            xhr.onerror = (err: any) => {
                reject(err);
            };
            xhr.send();
        });
    }
}
