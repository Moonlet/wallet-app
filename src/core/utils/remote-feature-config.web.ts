export enum RemoteFeature {
    COSMOS = 'feature_cosmos',
    NEAR = 'feature_near',
    CELO = 'feature_celo',
    DEV_TOOLS = 'dev_tools',
    TC_VERSION = 'tcVersion',
    NOTIF_CENTER = 'feature_notifications_center'
}

export const getRemoteConfigFeatures = () => {
    // TODO: decide if 1 hour should be the optimal fetch duration
    // set fetch cache duration to 1 hour for live environment
    return Promise.resolve();
};

export const isFeatureActive = (feature: RemoteFeature): boolean => {
    return false;
};

export const getFirebaseTCVersion = (): number => {
    return undefined;
};
