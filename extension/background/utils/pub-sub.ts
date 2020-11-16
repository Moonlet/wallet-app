export const PubSub = () => {
    const subscribers: { [event: string]: ((data) => any)[] } = {};

    function emit(event: string, data: any) {
        for (const sub of subscribers[event]) {
            if (typeof sub === 'function') {
                sub(data);
            } else {
                unsubscribe(event, sub);
            }
        }
    }

    function subscribe(event: string, cb: (data) => any): () => void {
        if (!subscribers[event]) {
            subscribers[event] = [];
        }

        subscribers[event].push(cb);

        return () => {
            unsubscribe(event, cb);
        };
    }

    function unsubscribe(event, cb) {
        const subs = subscribers[event];
        if (subs) {
            subs.splice(subs.indexOf(cb), 1);
        }
    }

    return { emit, subscribe, unsubscribe };
};
