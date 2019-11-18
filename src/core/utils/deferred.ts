export class Deferred {
    public promise;
    public resolve;
    public reject;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
