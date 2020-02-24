export const takeOneAndSubscribeToStore = (reduxStore, callback) => {
    const state = reduxStore?.getState();

    const unsubscribe = reduxStore.subscribe(() => callback(reduxStore.getState(), unsubscribe));

    if (state) {
        callback(state, unsubscribe);
    }

    return unsubscribe;
};
