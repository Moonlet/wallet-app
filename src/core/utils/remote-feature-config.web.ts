export enum RemoteFeature {
    BETA_BADGE = 'beta_badge',
    ZIL = 'feature_zil',
    NEAR = 'feature_near',
    COSMOS = 'feature_cosmos',
    CELO = 'feature_celo',
    DEV_TOOLS = 'dev_tools',
    TC_VERSION = 'tcVersion'
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
