interface PubSubSubscriber {
    meta: any;
    // tslint:disable-next-line: ban-types
    callbacks: Function[];
}

export class PubSub<E = string> {
    private subscribers: Map<E, PubSubSubscriber> = new Map();

    private removeSubscriber(event, cb) {
        if (this.subscribers.has(event)) {
            const subs = this.subscribers.get(event);
            subs.callbacks.splice(subs.callbacks.indexOf(cb), 1);
        }
    }

    public emit(event: E, data: any) {
        this.subscribers.get(event)?.callbacks?.forEach(cb => {
            if (typeof cb === 'function') {
                cb(data);
            } else {
                this.removeSubscriber(event, cb);
            }
        });
    }

    public subscribe(event: E, cb: (data) => void, meta: any): () => void {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, { meta, callbacks: [] });
        }

        this.subscribers.get(event)?.callbacks.push(cb);

        return () => {
            this.removeSubscriber(event, cb);
        };
    }

    public getEvents(): E[] {
        return Array.from(this.subscribers.keys());
    }

    public getMeta(event: E): any {
        return this.subscribers.get(event)?.meta;
    }

    public hasSubscribers(event: E): boolean {
        return this.subscribers.get(event)?.callbacks?.length > 0;
    }
}
