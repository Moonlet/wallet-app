const modalInstances = [];
const listeners = [];

export const attachListener = listener => {
    if (listeners.indexOf(listener) > -1) {
        return;
    }
    listeners.push(listener);
};

export const pushInstance = instance => {
    if (modalInstances.includes(instance)) {
        return;
    }
    modalInstances.push(instance);
    notifyInstances(modalInstances.length, modalInstances[0]);
};

export const notifyInstances = (length, topModalInstance) => {
    listeners.forEach(listener => {
        listener(length, topModalInstance);
    });
};

export const removeInstance = instance => {
    if (instance === modalInstances[0]) {
        modalInstances.shift();
        notifyInstances(modalInstances.length, modalInstances[0]);
    }
};

export const removeInstanceOnUnmount = (instance, listener) => {
    if (modalInstances.indexOf(instance) > -1) {
        modalInstances.splice(modalInstances.indexOf(instance), 1);
    }

    if (listeners.indexOf(listener) > -1) {
        listeners.splice(listeners.indexOf(listener), 1);
    }
};
