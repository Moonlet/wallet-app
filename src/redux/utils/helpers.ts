export const takeOneAndSubscribeToStore = (reduxStore, callback) => {
    const state = reduxStore?.getState();

    const unsubscribe = reduxStore.subscribe(() => callback(reduxStore.getState(), unsubscribe));

    if (state) {
        callback(state, unsubscribe);
    }

    return unsubscribe;
};

export const flattenObject = (obj, levels = Infinity) => {
    if (typeof obj === 'object' && levels > 0) {
        const flatObj = {};

        for (const key in obj) {
            if (typeof obj[key] === 'object' && Object.keys(obj[key]).length > 0) {
                const flatChild = flattenObject(obj[key], levels - 1);

                if (typeof flatChild === 'object' && Object.keys(flatChild).length > 0) {
                    for (const childKey in flatChild) {
                        if (flatChild.hasOwnProperty(childKey))
                            flatObj[`${key}.${childKey}`] = flatChild[childKey];
                    }
                } else {
                    flatObj[key] = flatChild;
                }
            } else {
                flatObj[key] = obj[key];
            }
        }
        return flatObj;
    } else {
        return obj;
    }
};
