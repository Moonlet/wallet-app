const subscribers: any[] = [];

const store = {
    dispatch: jest.fn(),
    getState: jest.fn().mockReturnValue({ _persist: { rehydrated: true } }),
    subscribe: jest.fn((cb: any) => {
        subscribers.push(cb);
    })
};

export default () => store;

export const triggerStoreSubscribe = (...params: any[]) => {
    for (const sub of subscribers) {
        sub(...params);
    }
};
