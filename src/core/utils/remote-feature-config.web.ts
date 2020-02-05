export enum RemoteFeature {
    NEAR = 'feature_near'
}

export const getRemoteConfigFeatures = () => {
    // TODO: decide if 1 hour should be the optimal fetch duration
    // set fetch cache duration to 1 hour for live environment
    return Promise.resolve();
};

export const isFeatureActive = (feature: RemoteFeature): boolean => {
    return false;
};
