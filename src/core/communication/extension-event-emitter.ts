const emit = async (event, data?) => {
    // noop
};

const onMessage = (cb): (() => void) => {
    return () => {
        // noop
    };
};

export const ExtensionEventEmitter = { emit, onMessage };
