export class Deferred<T> {
    public promise: Promise<T>;
    public resolve;
    public reject;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
