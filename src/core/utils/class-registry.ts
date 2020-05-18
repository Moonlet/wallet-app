const instances: Map<any, any> = new Map();
const instancesCbs: Map<any, ((cb) => any)[]> = new Map();

export const getInstance = <T = any>(key: any): T => {
    return instances.get(key);
};

const onInstance = (key, cb: (instance) => any): (() => any) => {
    const cbs = instancesCbs.get(key);

    if (Array.isArray(cbs)) {
        cbs.push(cb);
    } else {
        instancesCbs.set(key, [cb]);
    }

    return () => {
        const callbacks = instancesCbs.get(key) || [];
        callbacks.splice(callbacks.indexOf(cb), 1);
    };
};

export const waitForInstance = <T = any>(key: any, timeout: number = 5000): Promise<T> => {
    return new Promise((resolve, reject) => {
        if (instances.has(key)) {
            return resolve(instances.get(key));
        }

        const unsub = onInstance(key, instance => {
            resolve(instance);
            unsub();
            clearTimeout(timer);
        });

        const timer = setTimeout(() => {
            unsub();
            reject('TIMEOUT');
        }, timeout);
    });
};

export const setInstance = <T = any>(key: any, instance: T) => {
    instances.set(key, instance);

    if (instancesCbs.has(key)) {
        // copy callback in other array to avoid changing an array while itarating it.
        const cbs = instancesCbs.get(key).map(cb => cb);
        cbs.map(cb => cb(instance));
    }
};
